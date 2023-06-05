import { Controller, Put, Query, UseInterceptors } from '@nestjs/common';
import { Permissions } from "@core/services/permission.service";
import { UserSecure } from "@src/common/auth/user/decorators/userSecure.decorator";
import { ACL } from '@common/auth/decorators/acl.decorator';
import { ResponseService } from '@core/services/response.service';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { CoreTransformInterceptor } from '@core/interceptors/coreTransform.interceptor';
import { ZoneProvinceService } from '../services/zoneProvince.service';
import { ZoneDistrictService } from '../services/zoneDistrict.service';
import { ZoneWardService } from '../services/zoneWard.service';
import { TransformerZoneService } from '../services/transformerZone.service';
import { HelperService } from '@core/services/helper.service';

const XLSX = require('xlsx'); 
const csv = require('csv-parser');
const fs = require('fs');

@ApiTags('Admin/ZoneSync')
@Controller('admin/zone-sync')
@UseInterceptors(CoreTransformInterceptor)
@UserSecure()
export class BeZoneSyncController {
    constructor(
        private zoneProvinceService: ZoneProvinceService,
        private zoneDistrictService: ZoneDistrictService,
        private zoneWardService: ZoneWardService,
        private transformer: TransformerZoneService,
        private response: ResponseService,
        private helperService: HelperService
    ) {}

    @Put('province-code')
    @ApiExcludeEndpoint()
    @ACL(Permissions.zone_province_sync)
    async syncProvinceCode(@Query() query: Record<string, any>): Promise<any> {
        let self = this;
        
        let data;
        let workBook    = XLSX.readFile('storage/data/province-code.xlsx', {type: 'binary'});
        workBook.SheetNames.forEach(sheet => {
            data = XLSX.utils.sheet_to_json(workBook.Sheets[sheet]);
            return data;
        });

        data = data.map( async (row) => {
            let normalId    = row['PROVINCEID'];
            let provinceName      = row['PROVINCENAME'];
            
            let provinceNameNon = this.helperService.nonAccentVietnamese(provinceName);
            provinceNameNon = provinceNameNon.toLocaleLowerCase();
            
            const province = await this.zoneProvinceService.findByCondition({'name.viNon' : provinceNameNon});
            
            if(!province) {
                console.log(normalId, provinceName);
            
                return {
                    ...row,
                    normalId: normalId,
                    provincename: provinceNameNon,
                }

            }
            
            return {
                ...row,
                id: province.id,
                normalId: normalId,
                provincename: provinceNameNon,
            }

        });

        data.forEach(async (row, index) => {
            if(row['id']){
                await self.zoneProvinceService.update(row['id'], {
                    normalId: row['id'],
                });
            }
            
            
        });

        return {status: true};
    }

    @Put('provinces')
    @ACL(Permissions.zone_province_sync)
    @ApiExcludeEndpoint()
    async syncProvince(@Query() query: Record<string, any>): Promise<any> {
        let self = this;
        await this.zoneProvinceService.deleteManyByConditions({});
        await fs.createReadStream(`storage/data/zoneProvinces.csv`).pipe(csv()).on('data', async (row) => {
            await self.zoneProvinceService.create({
                normalId: row['id'],
                code: row['code'] == 'NULL' ? null : row['code'],
                active: row['status'] == '1' ? true : false,
                name: {
                    vi: row['name'],
                    en: await self.helperService.translateZoneNameVietnamese(row['name'], 1),
                },
                lat: row['lat'] == 'NULL' ? null : row['lat'],
                lng: row['lng'] == 'NULL' ? null : row['lng'],
                sortOrder: row['sortOrder'],
            });
        }).on('end', () => {
            console.log('Sync Province end!')
        });

        return {status: true};
    }

    @Put('district-code')
    @ApiExcludeEndpoint()
    @ACL(Permissions.zone_province_sync)
    async syncDistrictCode(@Query() query: Record<string, any>): Promise<any> {
        let self = this;
        
        let data;
        let workBook    = XLSX.readFile('storage/data/district-code.xlsx', {type: 'binary'});
        workBook.SheetNames.forEach(sheet => {
            data = XLSX.utils.sheet_to_json(workBook.Sheets[sheet]);
            return data;
        });

        data = data.map( async (row) => {
            let normalId    = row['DISTRICTID'];
            let districtName      = row['DISTRICTNAME'];
            
            let districtNameNon = this.helperService.nonAccentVietnamese(districtName);
            districtNameNon = districtNameNon.toLocaleLowerCase();
            
            const district = await this.zoneDistrictService.findByConditions({'name.viNon' : { $regex: districtNameNon, $options: 'i' }});
            
            if(!district) {
                console.log(normalId, districtName);
            
                return {
                    ...row,
                    normalId: normalId,
                    districtName: districtNameNon,
                }

            }
            
            return {
                ...row,
                id: district.id,
                normalId: normalId,
                provincename: districtNameNon,
            }

        });

        data.forEach(async (row, index) => {
            if(row['id']){
                await self.zoneDistrictService.update(row['id'], {
                    normalId: row['id'],
                });
            }
            
            
        });

        return {status: true};
    }

    @Put('districts')
    @ACL(Permissions.zone_district_sync)
    @ApiExcludeEndpoint()
    async syncDistrict(@Query() query: Record<string, any>): Promise<any> {
        let self = this;
        let provinceOfDistricts = {};
        await this.zoneDistrictService.deleteManyByConditions({});
        await fs.createReadStream(`storage/data/zoneDistricts.csv`).pipe(csv()).on('data', async (row) => {
            provinceOfDistricts[row['provinceId']] = provinceOfDistricts[row['provinceId']] || [];
            provinceOfDistricts[row['provinceId']].push(row);
        }).on('end', async () => {
            await Promise.all(Object.keys(provinceOfDistricts).map(async function(provinceId) {
                const province = await self.zoneProvinceService.findByNormalId(parseInt(provinceId));
                if(!province) return;
                await Promise.all(provinceOfDistricts[provinceId].map(async function(district) {
                    await self.zoneDistrictService.create({
                        zoneProvince: province.id,
                        normalId: district['id'],
                        code: district['code'] == 'NULL' ? null : district['code'],
                        active: district['status'] == '1' ? true : false,
                        name: {
                            vi: district['name'],
                            en: await self.helperService.translateZoneNameVietnamese(district['name'], 2),
                        },
                        lat: district['lat'] == 'NULL' ? null : district['lat'],
                        lng: district['lng'] == 'NULL' ? null : district['lng'],
                        sortOrder: district['sortOrder'],
                    });
                }));
            }));
            console.log('Sync District end!');
        });

        return {status: true};
    }

    @Put('wards')
    @ACL(Permissions.zone_ward_sync)
    @ApiExcludeEndpoint()
    async syncWard(@Query() query: Record<string, any>): Promise<any> {
        let self = this;
        let districtOfWards = {};
        await this.zoneWardService.deleteManyByConditions({});
        await fs.createReadStream(`storage/data/zoneWards.csv`).pipe(csv()).on('data', async (row) => {
            districtOfWards[row['districtId']] = districtOfWards[row['districtId']] || [];
            districtOfWards[row['districtId']].push(row);
        }).on('end', async () => {
            await Promise.all(Object.keys(districtOfWards).map(async function(districtId) {
                const district = await self.zoneDistrictService.findByNormalId(parseInt(districtId));
                if(!district) return;
                await Promise.all(districtOfWards[districtId].map(async function(ward) {
                    await self.zoneWardService.create({
                        zoneDistrict: district.id,
                        normalId: ward['id'],
                        code: ward['code'] == 'NULL' ? null : ward['code'],
                        active: ward['status'] == '1' ? true : false,
                        name: {
                            vi: ward['name'],
                            en: await self.helperService.translateZoneNameVietnamese(ward['name'], 3),
                        },
                        lat: ward['lat'] == 'NULL' ? null : ward['lat'],
                        lng: ward['lng'] == 'NULL' ? null : ward['lng'],
                        sortOrder: ward['sortOrder'],
                    });
                }));
            }));
            console.log('Sync Ward end!');
        });

        return {status: true};
    }
}
