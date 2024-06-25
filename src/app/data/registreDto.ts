
export class RegistreDto  {
    id:string;
    username: string;
    email: string;
    is_superuser?: boolean;
    is_active: boolean;
    first_name?: string;
    last_name?: string;
    groups?: UserGroups[];
    user_permissions?: string[];
    passwordHash?: string;
}
export interface UserGroups {
    userId: string;
    user: ApplicationUser;
    groupId: string;
    group: Group;
}
export interface Group {
    id: string; 
    name: string;
    users: UserGroups[];
    permissions?: Permissions[];
}

export interface ApplicationUser {
    superuserStatus?: boolean;
    active?: boolean;
    firstName?: string;
    lastName?: string;
    groups?: UserGroups[];
    permissions?: string[];
}
export const permissions=["add_document",
    "view_document",
    "change_document",
    "delete_document",
    "add_tag",
    "view_tag",
    "change_tag",
    "delete_tag",
    "add_correspondent",
    "view_correspondent",
    "change_correspondent",
    "delete_correspondent",
    "add_documenttype",
    "view_documenttype",
    "change_documenttype",
    "delete_documenttype",
    "add_storagepath",
    "view_storagepath",
    "change_storagepath",
    "delete_storagepath",
    "add_savedview",
    "view_savedview",
    "change_savedview",
    "delete_savedview",
    "add_paperlesstask",
    "view_paperlesstask",
    "change_paperlesstask",
    "delete_paperlesstask",
    "add_uisettings",
    "view_uisettings",
    "change_uisettings",
    "delete_uisettings",
    "add_note",
    "view_note",
    "change_note",
    "delete_note",
    "add_mailaccount",
    "view_mailaccount",
    "change_mailaccount",
    "delete_mailaccount",
    "add_mailrule",
    "view_mailrule",
    "change_mailrule",
    "delete_mailrule",
    "add_user",
    "view_user",
    "change_user",
    "delete_user",
    "add_group",
    "view_group",
    "change_group",
    "delete_group",
    "add_logentry",
    "view_logentry",
    "change_logentry",
    "delete_logentry",
    "add_sharelink",
    "view_sharelink",
    "change_sharelink",
    "delete_sharelink",
    "add_consumptiontemplate",
    "view_consumptiontemplate",
    "change_consumptiontemplate",
    "delete_consumptiontemplate",
    "add_customfield",
    "view_customfield",
    "change_customfield",
    "delete_customfield"] 
    export const permissionsUser=["add_document",
        "view_document",
        "change_document",
        "delete_document",
        "add_tag",
        "view_tag",
        "change_tag",
        "delete_tag",
        "add_correspondent",
        "view_correspondent",
        "change_correspondent",
        "delete_correspondent",
        "add_documenttype",
        "view_documenttype",
        "change_documenttype",
        "delete_documenttype",
        "add_storagepath",
        "view_storagepath",
        "change_storagepath",
        "delete_storagepath",
        "add_savedview",
        "view_savedview",
        "change_savedview",
        "delete_savedview",
        "add_paperlesstask",
        "view_paperlesstask",
        "change_paperlesstask",
        "delete_paperlesstask",
        "add_uisettings",
        "view_uisettings",
        "change_uisettings",
        "delete_uisettings",
        "add_note",
        "view_note",
        "change_note",
        "delete_note",
        "add_mailaccount",
        "view_mailaccount",
        "change_mailaccount",
        "delete_mailaccount",
        "add_mailrule",
        "view_mailrule",
        "change_mailrule",
        "delete_mailrule",
        "add_logentry",
        "view_logentry",
        "change_logentry",
        "delete_logentry",
        "add_sharelink",
        "view_sharelink",
        "change_sharelink",
        "delete_sharelink",
        "add_consumptiontemplate",
        "view_consumptiontemplate",
        "change_consumptiontemplate",
        "delete_consumptiontemplate",
        "add_customfield",
        "view_customfield",
        "change_customfield",
        "delete_customfield"] 