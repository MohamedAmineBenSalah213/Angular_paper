export enum Permissions {
    // Document permissions
    AddDocument = 0, // 0 + (0 * 4) = 0
    ViewDocument = 1, // 1 + (0 * 4) = 1
    ChangeDocument = 2, // 2 + (0 * 4) = 2
    DeleteDocument = 3, // 3 + (0 * 4) = 3
  
    // Tag permissions
    AddTag = 4 + 0,
    ViewTag = 5 + 0,
    ChangeTag = 6 + 0,
    DeleteTag = 7 + 0,
  
    // Correspondent permissions
    AddCorrespondent = 8 + 0,
    ViewCorrespondent = 9 + 0,
    ChangeCorrespondent = 10 + 0,
    DeleteCorrespondent = 11 + 0,
  
    // DocumentType permissions
    AddDocumentType = 12 + 0,
    ViewDocumentType = 13 + 0,
    ChangeDocumentType = 14 + 0,
    DeleteDocumentType = 15 + 0,
  
    // StoragePath permissions
    AddStoragePath = 16 + 0,
    ViewStoragePath = 17 + 0,
    ChangeStoragePath = 18 + 0,
    DeleteStoragePath = 19 + 0,
  
    // SavedView permissions
    AddSavedView = 20 + 0,
    ViewSavedView = 21 + 0,
    ChangeSavedView = 22 + 0,
    DeleteSavedView = 23 + 0,
  
    // PaperlessTask permissions
    AddPaperlessTask = 24 + 0,
    ViewPaperlessTask = 25 + 0,
    ChangePaperlessTask = 26 + 0,
    DeletePaperlessTask = 27 + 0,
  
    // UISettings permissions
    AddUISettings = 28 + 0,
    ViewUISettings = 29 + 0,
    ChangeUISettings = 30 + 0,
    DeleteUISettings = 31 + 0,
  
    // Note permissions
    AddNote = 32 + 0,
    ViewNote = 33 + 0,
    ChangeNote = 34 + 0,
    DeleteNote = 35 + 0,
  
    // MailAccount permissions
    AddMailAccount = 36 + 0,
    ViewMailAccount = 37 + 0,
    ChangeMailAccount = 38 + 0,
    DeleteMailAccount = 39 + 0,
  
    // MailRule permissions
    AddMailRule = 40 + 0,
    ViewMailRule = 41 + 0,
    ChangeMailRule = 42 + 0,
    DeleteMailRule = 43 + 0,
  
    // User permissions
    AddUser = 44 + 0,
    ViewUser = 45 + 0,
    ChangeUser = 46 + 0,
    DeleteUser = 47 + 0,
  
    // Group permissions
    AddGroup = 48 + 0,
    ViewGroup = 49 + 0,
    ChangeGroup = 50 + 0,
    DeleteGroup = 51 + 0,
  
    // Admin permissions
    AddAdmin = 52 + 0,
    ViewAdmin = 53 + 0,
    ChangeAdmin = 54 + 0,
    DeleteAdmin = 55 + 0,
  
    // ShareLink permissions
    AddShareLink = 56 + 0,
    ViewShareLink = 57 + 0,
    ChangeShareLink = 58 + 0,
    DeleteShareLink = 59 + 0,
  
    // ConsumptionTemplate permissions
    AddConsumptionTemplate = 60 + 0,
    ViewConsumptionTemplate = 61 + 0,
    ChangeConsumptionTemplate = 62 + 0,
    DeleteConsumptionTemplate = 63 + 0,
  
    // CustomField permissions
    AddCustomField = 64 + 0,
    ViewCustomField = 65 + 0,
    ChangeCustomField = 66 + 0,
    DeleteCustomField = 67 + 0
  }
  
  export const PermissionNames = {
    [Permissions.AddDocument]: "add_document",
    [Permissions.ViewDocument]: "view_document",
    [Permissions.ChangeDocument]: "change_document",
    [Permissions.DeleteDocument]: "delete_document",
    [Permissions.AddTag]: "add_tag",
    [Permissions.ViewTag]: "view_tag",
    [Permissions.ChangeTag]: "change_tag",
    [Permissions.DeleteTag]: "delete_tag",
    [Permissions.AddCorrespondent]: "add_correspondent",
    [Permissions.ViewCorrespondent]: "view_correspondent",
    [Permissions.ChangeCorrespondent]: "change_correspondent",
    [Permissions.DeleteCorrespondent]: "delete_correspondent",
    [Permissions.AddDocumentType]: "add_document_type",
    [Permissions.ViewDocumentType]: "view_document_type",
    [Permissions.ChangeDocumentType]: "change_document_type",
    [Permissions.DeleteDocumentType]: "delete_document_type",
    [Permissions.AddStoragePath]: "add_storage_path",
    [Permissions.ViewStoragePath]: "view_storage_path",
    [Permissions.ChangeStoragePath]: "change_storage_path",
    [Permissions.DeleteStoragePath]: "delete_storage_path",
    [Permissions.AddSavedView]: "add_saved_view",
    [Permissions.ViewSavedView]: "view_saved_view",
    [Permissions.ChangeSavedView]: "change_saved_view",
    [Permissions.DeleteSavedView]: "delete_saved_view",
    [Permissions.AddPaperlessTask]: "add_paperless_task",
    [Permissions.ViewPaperlessTask]: "view_paperless_task",
    [Permissions.ChangePaperlessTask]: "change_paperless_task",
    [Permissions.DeletePaperlessTask]: "delete_paperless_task",
    [Permissions.AddUISettings]: "add_ui_settings",
    [Permissions.ViewUISettings]: "view_ui_settings",
    [Permissions.ChangeUISettings]: "change_ui_settings",
    [Permissions.DeleteUISettings]: "delete_ui_settings",
    [Permissions.AddNote]: "add_note",
    [Permissions.ViewNote]: "view_note",
    [Permissions.ChangeNote]: "change_note",
    [Permissions.DeleteNote]: "delete_note",
    [Permissions.AddMailAccount]: "add_mail_account",
    [Permissions.ViewMailAccount]: "view_mail_account",
    [Permissions.ChangeMailAccount]: "change_mail_account",
    [Permissions.DeleteMailAccount]: "delete_mail_account",
    [Permissions.AddMailRule]: "add_mail_rule",
    [Permissions.ViewMailRule]: "view_mail_rule",
    [Permissions.ChangeMailRule]: "change_mail_rule",
    [Permissions.DeleteMailRule]: "delete_mail_rule",
    [Permissions.AddUser]: "add_user",
    [Permissions.ViewUser]: "view_user",
    [Permissions.ChangeUser]: "change_user",
    [Permissions.DeleteUser]: "delete_user",
    [Permissions.AddGroup]: "add_group",
    [Permissions.ViewGroup]: "view_group",
    [Permissions.ChangeGroup]: "change_group",
    [Permissions.DeleteGroup]: "delete_group",
    [Permissions.AddAdmin]: "add_admin",
    [Permissions.ViewAdmin]: "view_admin",
    [Permissions.ChangeAdmin]: "change_admin",
    [Permissions.DeleteAdmin]: "delete_admin",
    [Permissions.AddShareLink]: "add_share_link",
    [Permissions.ViewShareLink]: "view_share_link",
    [Permissions.ChangeShareLink]: "change_share_link",
    [Permissions.DeleteShareLink]: "delete_share_link",
    [Permissions.AddConsumptionTemplate]: "add_consumption_template",
    [Permissions.ViewConsumptionTemplate]: "view_consumption_template",
    [Permissions.ChangeConsumptionTemplate]: "change_consumption_template",
    [Permissions.DeleteConsumptionTemplate]: "delete_consumption_template",
    [Permissions.AddCustomField]: "add_custom_field",
    [Permissions.ViewCustomField]: "view_custom_field",
    [Permissions.ChangeCustomField]: "change_custom_field",
    [Permissions.DeleteCustomField]: "delete_custom_field"
  };
  