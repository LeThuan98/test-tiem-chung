import { Injectable } from '@nestjs/common';
@Injectable()
export class PermissionService {
    static permissions;

    constructor() {
        PermissionService.permissions = {
            allow: [
                {
                    group: 'Log',
                    items: {
                        [Permissions.log_list]: 'View',
                    },
                },
                {
                    group: 'Setting',
                    items: {
                        [Permissions.setting_list]: 'View',
                        [Permissions.setting_update]: 'Update',
                    },
                },
                {
                    group: 'Filemanager',
                    items: {
                        [Permissions.file_manager_list]: 'List file manager',
                        [Permissions.file_manager_detail]: 'Detail file manager',
                        [Permissions.file_manager_add]: 'Add file manager',
                        [Permissions.file_manager_edit]: 'Edit file manager',
                        [Permissions.file_manager_delete]: 'Delete file manager',
                    },
                },
                {
                    group: 'Province',
                    items: {
                        [Permissions.zone_province_list]: 'List province',
                        [Permissions.zone_province_detail]: 'Detail province',
                        [Permissions.zone_province_add]: 'Add province',
                        [Permissions.zone_province_edit]: 'Edit province',
                        [Permissions.zone_province_delete]: 'Delete province',
                        [Permissions.zone_province_sync]: 'Sync province',
                    },
                },
                {
                    group: 'District',
                    items: {
                        [Permissions.zone_district_list]: 'List district',
                        [Permissions.zone_district_detail]: 'Detail district',
                        [Permissions.zone_district_add]: 'Add district',
                        [Permissions.zone_district_edit]: 'Edit district',
                        [Permissions.zone_district_delete]: 'Delete district',
                        [Permissions.zone_district_sync]: 'Sync district',
                    },
                },
                {
                    group: 'Ward',
                    items: {
                        [Permissions.zone_ward_list]: 'List ward',
                        [Permissions.zone_ward_detail]: 'Detail ward',
                        [Permissions.zone_ward_add]: 'Add ward',
                        [Permissions.zone_ward_edit]: 'Edit ward',
                        [Permissions.zone_ward_delete]: 'Delete ward',
                        [Permissions.zone_ward_sync]: 'Sync ward',
                    },
                },
                {
                    group: 'User',
                    items: {
                        [Permissions.user_list]: 'List user',
                        [Permissions.user_detail]: 'Detail user',
                        [Permissions.user_add]: 'Add user',
                        [Permissions.user_edit]: 'Edit user',
                        [Permissions.user_delete]: 'Delete user',
                    },
                },
                {
                    group: 'Role',
                    items: {
                        [Permissions.role_list]: 'List role',
                        [Permissions.role_detail]: 'Detail role',
                        [Permissions.role_add]: 'Add role',
                        [Permissions.role_edit]: 'Edit role',
                        [Permissions.role_delete]: 'Delete role',
                    },
                },
                {
                    group: 'Customer',
                    items: {
                        [Permissions.customer_list]: 'List customer',
                        [Permissions.customer_detail]: 'Detail customer',
                        [Permissions.customer_add]: 'Add customer',
                        [Permissions.customer_edit]: 'Edit customer',
                        [Permissions.customer_delete]: 'Delete customer',
                    },
                },
                // {
                //     group: 'Job Contract',
                //     items: {
                //         [Permissions.job_contract_list]: 'List job contract',
                //         [Permissions.job_contract_detail]: 'Detail job contract',
                //         [Permissions.job_contract_add]: 'Add job contract',
                //         [Permissions.job_contract_edit]: 'Edit job contract',
                //         [Permissions.job_contract_delete]: 'Delete job contract',
                //     },
                // },
                // {
                //     group: 'Job Department',
                //     items: {
                //         [Permissions.job_department_list]: 'List job department',
                //         [Permissions.job_department_detail]: 'Detail job department',
                //         [Permissions.job_department_add]: 'Add job department',
                //         [Permissions.job_department_edit]: 'Edit job department',
                //         [Permissions.job_department_delete]: 'Delete job department',
                //     },
                // },
                // {
                //     group: 'Job',
                //     items: {
                //         [Permissions.job_list]: 'List job',
                //         [Permissions.job_detail]: 'Detail job',
                //         [Permissions.job_add]: 'Add job',
                //         [Permissions.job_edit]: 'Edit job',
                //         [Permissions.job_delete]: 'Delete job',
                //     },
                // },

                // {
                //     group: 'Job Applicant',
                //     items: {
                //         [Permissions.job_applicant_list]: 'List job applicant',
                //         [Permissions.job_applicant_detail]: 'Detail job applicant',
                //         [Permissions.job_applicant_add]: 'Add job applicant',
                //         [Permissions.job_applicant_edit]: 'Edit job applicant',
                //         [Permissions.job_applicant_delete]: 'Delete job applicant',
                //     },
                // },
                {
                    group: 'Tag',
                    items: {
                        [Permissions.tag_list]: 'List tag',
                        [Permissions.tag_detail]: 'Detail tag',
                        [Permissions.tag_add]: 'Add tag',
                        [Permissions.tag_edit]: 'Edit tag',
                        [Permissions.tag_delete]: 'Delete tag',
                    },
                },
                {
                    group: 'PostCategory',
                    items: {
                        [Permissions.post_category_list]: 'List post category',
                        [Permissions.post_category_detail]: 'Detail post category',
                        [Permissions.post_category_add]: 'Add post category',
                        [Permissions.post_category_edit]: 'Edit post category',
                        [Permissions.post_category_delete]: 'Delete post category',
                    },
                },
                {
                    group: 'Post',
                    items: {
                        [Permissions.post_list]: 'List post',
                        [Permissions.post_detail]: 'Detail post',
                        [Permissions.post_add]: 'Add post',
                        [Permissions.post_edit]: 'Edit post',
                        [Permissions.post_delete]: 'Delete post',
                    },
                },
                {
                    group: 'Post View Status',
                    items: {
                        [Permissions.post_view_self]: 'View Selft',
                        [Permissions.post_view_status_1]: 'New',
                        [Permissions.post_view_status_2]: 'In-Review',
                        [Permissions.post_view_status_3]: 'Published',
                        [Permissions.post_view_status_4]: 'In-Active',
                        [Permissions.post_view_status_5]: 'In-Draft',
                        [Permissions.post_view_status_5]: 'In-Draft',
                    },
                },
                {
                    group: 'Post Default Status',
                    items: {
                        [Permissions.post_default_status_1]: 'New',
                        [Permissions.post_default_status_2]: 'In-Review',
                        [Permissions.post_default_status_3]: 'Published',
                        [Permissions.post_default_status_4]: 'In-Active',
                        [Permissions.post_default_status_5]: 'In-Draft',
                    },
                },
                {
                    group: 'Faq',
                    items: {
                        [Permissions.faq_list]: 'List faq',
                        [Permissions.faq_detail]: 'Detail faq',
                        [Permissions.faq_add]: 'Add faq',
                        [Permissions.faq_edit]: 'Edit faq',
                        [Permissions.faq_delete]: 'Delete faq',
                    },
                },
                {
                    group: 'Ask',
                    items: {
                        [Permissions.ask_list]: 'List ask',
                        [Permissions.ask_detail]: 'Detail ask',
                        [Permissions.ask_add]: 'Add ask',
                        [Permissions.ask_edit]: 'Edit ask',
                        [Permissions.ask_delete]: 'Delete ask',
                    },
                },
                {
                    group: 'Vaccination Schedule',
                    items: {
                        [Permissions.schedule_list]: 'List schedule',
                        [Permissions.schedule_detail]: 'Detail schedule',
                        [Permissions.schedule_add]: 'Add schedule',
                        [Permissions.schedule_edit]: 'Edit schedule',
                        [Permissions.schedule_delete]: 'Delete schedule',
                    },
                },
                {
                    group: 'Object',
                    items: {
                        [Permissions.object_list]: 'List object',
                        [Permissions.object_detail]: 'Detail object',
                        [Permissions.object_add]: 'Add object',
                        [Permissions.object_edit]: 'Edit object',
                        [Permissions.object_delete]: 'Delete object',
                    },
                },
                {
                    group: 'Object Post',
                    items: {
                        [Permissions.object_post_list]: 'List object post',
                        [Permissions.object_post_detail]: 'Detail object post',
                        [Permissions.object_post_add]: 'Add object post',
                        [Permissions.object_post_edit]: 'Edit object post',
                        [Permissions.object_post_delete]: 'Delete object post',
                    },
                },
                {
                    group: 'Disease',
                    items: {
                        [Permissions.disease_list]: 'List disease',
                        [Permissions.disease_detail]: 'Detail disease',
                        [Permissions.disease_add]: 'Add disease',
                        [Permissions.disease_edit]: 'Edit disease',
                        [Permissions.disease_delete]: 'Delete disease',
                    },
                },
                // {
                //     group: 'Subscribe',
                //     items: {
                //         [Permissions.subscribe_list]: 'List subscribe',
                //         [Permissions.subscribe_detail]: 'Detail subscribe',
                //         [Permissions.subscribe_add]: 'Add subscribe',
                //         [Permissions.subscribe_edit]: 'Edit subscribe',
                //         [Permissions.subscribe_delete]: 'Delete subscribe',
                //     },
                // },
                // {
                //     group: 'Contact',
                //     items: {
                //         [Permissions.contact_list]: 'List contact',
                //         [Permissions.contact_detail]: 'Detail contact',
                //         [Permissions.contact_add]: 'Add contact',
                //         [Permissions.contact_edit]: 'Edit contact',
                //         [Permissions.contact_delete]: 'Delete contact',
                //     },
                // },
                // {
                //     group: 'Place',
                //     items: {
                //         [Permissions.place_list]: 'List Place',
                //         [Permissions.place_detail]: 'Detail Place',
                //         [Permissions.place_add]: 'Add Place',
                //         [Permissions.place_edit]: 'Edit Place',
                //         [Permissions.place_delete]: 'Delete Place',
                //     },
                // },
                {
                    group: 'Page',
                    items: {
                        [Permissions.page_list]: 'List Page',
                        [Permissions.page_detail]: 'Detail Page',
                        [Permissions.page_add]: 'Add Page',
                        [Permissions.page_edit]: 'Edit Page',
                        [Permissions.page_delete]: 'Delete Page',
                    },
                },
                {
                    group: 'Dashboard',
                    items: {
                        [Permissions.dashboard_list]: 'List Dashboard',
                    },
                },
                {
                    group: 'Activity',
                    items: {
                        [Permissions.activity_list]: 'Activity List',
                    },
                },
            ],
            except: [],
        };
    }
}

export enum Permissions {
    /*
    Setting
     */
    setting_list = 'setting_list',
    setting_update = 'setting_update',

    /*
    File manager
    */
    file_manager_list = 'file_manager_list',
    file_manager_detail = 'file_manager_detail',
    file_manager_add = 'file_manager_add',
    file_manager_edit = 'file_manager_edit',
    file_manager_delete = 'file_manager_delete',

    /*
    Zone province
     */
    zone_province_list = 'zone_province_list',
    zone_province_detail = 'zone_province_detail',
    zone_province_add = 'zone_province_add',
    zone_province_edit = 'zone_province_edit',
    zone_province_delete = 'zone_province_delete',
    zone_province_sync = 'zone_province_sync',

    /*
    Zone district
     */
    zone_district_list = 'zone_district_list',
    zone_district_detail = 'zone_district_detail',
    zone_district_add = 'zone_district_add',
    zone_district_edit = 'zone_district_edit',
    zone_district_delete = 'zone_district_delete',
    zone_district_sync = 'zone_district_sync',

    /*
    Zone ward
     */
    zone_ward_list = 'zone_ward_list',
    zone_ward_detail = 'zone_ward_detail',
    zone_ward_add = 'zone_ward_add',
    zone_ward_edit = 'zone_ward_edit',
    zone_ward_delete = 'zone_ward_delete',
    zone_ward_sync = 'zone_ward_sync',

    /*
    Vax Schedule
     */
    schedule_list = 'schedule_list',
    schedule_detail = 'schedule_detail',
    schedule_add = 'schedule_add',
    schedule_edit = 'schedule_edit',
    schedule_delete = 'schedule_delete',

    /*
    User
     */
    user_list = 'user_list',
    user_detail = 'user_detail',
    user_add = 'user_add',
    user_edit = 'user_edit',
    user_delete = 'user_delete',

    /*
    Role
     */
    role_list = 'role_list',
    role_detail = 'role_detail',
    role_add = 'role_add',
    role_edit = 'role_edit',
    role_delete = 'role_delete',

    /*
    Customer
    */
    customer_list = 'customer_list',
    customer_detail = 'customer_detail',
    customer_add = 'customer_add',
    customer_edit = 'customer_edit',
    customer_delete = 'customer_delete',

    /*
    Log
    */
    log_list = 'log_list',

    /*
     * Job Contract
     * */
    // job_contract_list = 'job_contract_list',
    // job_contract_detail = 'job_contract_detail',
    // job_contract_add = 'job_contract_add',
    // job_contract_edit = 'job_contract_edit',
    // job_contract_delete = 'job_contract_delete',

    /*
     * Job Department
     * */
    // job_department_list = 'job_department_list',
    // job_department_detail = 'job_department_detail',
    // job_department_add = 'job_department_add',
    // job_department_edit = 'job_department_edit',
    // job_department_delete = 'job_department_delete',

    /*
     * Job
     * */
    // job_list = 'job_list',
    // job_detail = 'job_detail',
    // job_add = 'job_add',
    // job_edit = 'job_edit',
    // job_delete = 'job_delete',

    /*
     * Job Applicant
     * */
    // job_applicant_list = 'job_applicant_list',
    // job_applicant_detail = 'job_applicant_detail',
    // job_applicant_add = 'job_applicant_add',
    // job_applicant_edit = 'job_applicant_edit',
    // job_applicant_delete = 'job_applicant_delete',

    /*
     * Tag
     * */
    tag_list = 'tag_list',
    tag_detail = 'tag_detail',
    tag_add = 'tag_add',
    tag_edit = 'tag_edit',
    tag_delete = 'tag_delete',

    /*
     * Post Category
     * */
    post_category_list = 'post_category_list',
    post_category_detail = 'post_category_detail',
    post_category_add = 'post_category_add',
    post_category_edit = 'post_category_edit',
    post_category_delete = 'post_category_delete',

    /*
     * Post
     * */
    post_list = 'post_list',
    post_detail = 'post_detail',
    post_add = 'post_add',
    post_edit = 'post_edit',
    post_delete = 'post_delete',

    post_view_self = 'post_view_self',
    post_view_status_1 = 'post_view_status_1',
    post_view_status_2 = 'post_view_status_2',
    post_view_status_3 = 'post_view_status_3',
    post_view_status_4 = 'post_view_status_4',
    post_view_status_5 = 'post_view_status_5',

    post_default_status_1 = 'post_default_status_1',
    post_default_status_2 = 'post_default_status_2',
    post_default_status_3 = 'post_default_status_3',
    post_default_status_4 = 'post_default_status_4',
    post_default_status_5 = 'post_default_status_5',

    /*
    Contact
    */
    // contact_list = 'contact_list',
    // contact_detail = 'contact_detail',
    // contact_add = 'contact_add',
    // contact_edit = 'contact_edit',
    // contact_delete = 'contact_delete',

    /*
    Subscribe
    */
    // subscribe_list = 'subscribe_list',
    // subscribe_detail = 'subscribe_detail',
    // subscribe_add = 'subscribe_add',
    // subscribe_edit = 'subscribe_edit',
    // subscribe_delete = 'subscribe_delete',

    /*
    Place
    */
    // place_list = 'place_list',
    // place_detail = 'place_detail',
    // place_add = 'place_add',
    // place_edit = 'place_edit',
    // place_delete = 'place_delete',

    /*Activities*/
    // activity_list = 'activity_list',

    /*
    Booth Area
    */
    // booth_area_list = 'booth_area_list',
    // booth_area_detail = 'booth_area_detail',
    // booth_area_add = 'booth_area_add',
    // booth_area_edit = 'booth_area_edit',
    // booth_area_delete = 'booth_area_delete',

    /*
    Event
    */
    // event_list = 'event_list',
    // event_detail = 'event_detail',
    // event_add = 'event_add',
    // event_edit = 'event_edit',
    // event_delete = 'event_delete',

    /*
    Category
    */
    category_list = 'category_list',
    category_detail = 'category_detail',
    category_add = 'category_add',
    category_edit = 'category_edit',
    category_delete = 'category_delete',

    /*
    Comics
    */
    comics_list = 'comics_list',
    comics_detail = 'comics_detail',
    comics_add = 'comics_add',
    comics_edit = 'comics_edit',
    comics_delete = 'comics_delete',

    /*
    Chapter
    */
    chapter_list = 'chapter_list',
    chapter_detail = 'chapter_detail',
    chapter_add = 'chapter_add',
    chapter_edit = 'chapter_edit',
    chapter_delete = 'chapter_delete',

    /*
    Like
    */
    like_list = 'like_list',
    like_detail = 'like_detail',
    like_add = 'like_add',
    like_edit = 'like_edit',
    like_delete = 'like_delete',

    /*
    Follow
    */
    follow_list = 'follow_list',
    follow_detail = 'follow_detail',
    follow_add = 'follow_add',
    follow_edit = 'follow_edit',
    follow_delete = 'follow_delete',

    /*
    Signal
    */
    signal_list = 'signal_list',
    signal_detail = 'signal_detail',
    signal_add = 'signal_add',
    signal_edit = 'signal_edit',
    signal_delete = 'signal_delete',

    /*
    Page
    */
    page_list = 'page_list',
    page_detail = 'page_detail',
    page_add = 'page_add',
    page_edit = 'page_edit',
    page_delete = 'page_delete',

    /*
    Keyword
    */
    keyword_list = 'keyword_list',
    keyword_detail = 'keyword_detail',
    keyword_add = 'keyword_add',
    keyword_edit = 'keyword_edit',
    keyword_delete = 'keyword_delete',

    /*
    Message
    */
    message_list = 'message_list',
    message_detail = 'message_detail',
    message_add = 'message_add',
    message_edit = 'message_edit',
    message_delete = 'message_delete',

    /*
    History
    */
    history_list = 'history_list',
    history_detail = 'history_detail',
    history_add = 'history_add',
    history_edit = 'history_edit',
    history_delete = 'history_delete',

    /*
    Faq
    */
    faq_list = 'faq_list',
    faq_detail = 'faq_detail',
    faq_add = 'faq_add',
    faq_edit = 'faq_edit',
    faq_delete = 'faq_delete',

    /*
    Faq
    */
    ask_list = 'ask_list',
    ask_detail = 'ask_detail',
    ask_add = 'ask_add',
    ask_edit = 'ask_edit',
    ask_delete = 'ask_delete',

    /*
    Dashboard
    */
    dashboard_list = 'dashboard_list',

    /*
    Active
    */
    activity_list = 'activity_list',

    /*
    Object
    */
    object_list = 'object_list',
    object_detail = 'object_detail',
    object_add = 'object_add',
    object_edit = 'object_edit',
    object_delete = 'object_delete',

      /*
    Object
    */
    object_post_list = 'object_post_list',
    object_post_detail = 'object_post_detail',
    object_post_add = 'object_post_add',
    object_post_edit = 'object_post_edit',
    object_post_delete = 'object_post_delete',

      /*
    Disease
    */
    disease_list = 'disease_list',
    disease_detail = 'disease_detail',
    disease_add = 'disease_add',
    disease_edit = 'disease_edit',
    disease_delete = 'disease_delete',

}
