import { Injectable } from '@nestjs/common';
import { PaginateModel } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Setting } from "@schemas/setting.schemas";
import { deleteFile, saveFile, isFile } from '@core/helpers/file';
@Injectable()
export class SettingService {
    constructor(
        @InjectModel(Setting.name) private setting: PaginateModel<Setting>,
    ) {}

    async findAll(): Promise<any> {
        return this.setting.find().exec();
    }

    async update(data: Record<string, any>, files: Array<object>): Promise<any> {
        let settings = [];
        let oldFiles = [];
        Object.keys(data).forEach(function(name) {
            settings.push({
                'name': name,
                'value': data[name]
            });

            if(isFile(data[name])) {
                oldFiles.push(data[name]);
            }
        });
        await Promise.all(files.map(async function(file) {
            settings.push({
                'name': file['fieldname'],
                'value': file['filename'],
            });
            await saveFile(file['filename'], `setting`);
        }));
        // await this.setting.find({}, function (error, docs) {
        //     docs.forEach(function (doc) {
        //         if (isFile(doc.value) && !oldFiles.includes(doc.value)) {
        //             deleteFile(doc.value, `setting`);
        //         }
        //         doc.remove();
        //     });
        // }).clone.catch(function (err) { console.log(err) });
        await this.setting.deleteMany({});
        await this.setting.insertMany(settings);
        return this.setting.find().exec();
    }

}
