import { Injectable } from '@angular/core'
import { ObjectWithPermissions } from '../data/object-with-permissions'
import { User } from '../data/user'



export enum PermissionAction {
  Add = 'add',
  View = 'view',
  Change = 'change',
  Delete = 'delete',
}

export enum PermissionType {
  Document = '%s_document',
  Tag = '%s_tag',
  Correspondent = '%s_correspondent',
  DocumentType = '%s_documenttype',
  StoragePath = '%s_storagepath',
  Task = '%s_task',
  UISettings = '%s_uisettings',
  Note = '%s_note',
  MailAccount = '%s_mailaccount',
  MailRule = '%s_mailrule',
  User = '%s_user',
  Group = '%s_group',
  ConsumptionTemplate = '%s_consumptiontemplate',
  CustomField = '%s_customfield',
}

@Injectable({
  providedIn: 'root',
})
export class PermissionsService {
  private permissions: string[]
  private currentUser: User
  private role :string
  public initialize(permissions: string[], currentUser: User,role:string) {
    this.permissions = permissions
    this.currentUser = currentUser
    this.role=role
  }

  public currentUserCan(
    action: PermissionAction,
    type: PermissionType
  ): boolean {
    return (
      this.currentUser?.is_superuser ||
      this.permissions?.includes(this.getPermissionCode(action, type))
    )
  }
  public getCurrentUserID():string{
    return this.currentUser.id
  }
  public getCurrentUserRole():string
  {    
    return this.role.toString()
  }
  public currentUserOwnsObject(object: ObjectWithPermissions): boolean {
   /// debugger
    return (
      !object ||
      !object.owner ||
      this.currentUser.is_superuser ||
      object.owner === this.currentUser.id
    ) 
    return true
  }

  public currentUserHasObjectPermissions(
    action: string,
    object: ObjectWithPermissions
  ): boolean {
    if (action === PermissionAction.View) {
      console.log('Checking view permissions...');
      const ownsObject = this.currentUserOwnsObject(object);
      const userHasViewPermission = object.permissions?.view?.users?.includes(this.currentUser.id) || false;
      const groupHasViewPermission = object.permissions?.view?.groups?.some((g) =>
        this.currentUser.groups.includes(g)
      ) || false;
  
      console.log('User owns object:', ownsObject);
      console.log('User has view permission:', userHasViewPermission);
      console.log('Group has view permission:', groupHasViewPermission);
  
      return ownsObject || userHasViewPermission || groupHasViewPermission;
    } else if (action === PermissionAction.Change) {
      console.log('Checking change permissions...');
      const ownsObject = this.currentUserOwnsObject(object);
      const userCanChange = object.user_can_change || false;
      const userHasChangePermission = object.permissions?.change?.users?.includes(this.currentUser.id) || false;
      const groupHasChangePermission = object.permissions?.change?.groups?.some((g) =>
        this.currentUser.groups.includes(g)
      ) || false;
  
      console.log('User owns object:', ownsObject);
      console.log('User can change:', userCanChange);
      console.log('User has change permission:', userHasChangePermission);
      console.log('Group has change permission:', groupHasChangePermission);
  
      return ownsObject || userCanChange || userHasChangePermission || groupHasChangePermission;
    }
  }
    // If the action is not View or Change, return false by
  
  

  public getPermissionCode(
    action: PermissionAction,
    type: PermissionType
  ): string {
    return type.replace('%s', action)
  }

  public getPermissionKeys(permissionStr: string): {
    actionKey: string
    typeKey: string
  } {
    const matches = permissionStr.match(/(.+)_/)
    let typeKey
    let actionKey
    if (matches?.length > 0) {
      const action = matches[1]
      const actionIndex = Object.values(PermissionAction).indexOf(
        action as PermissionAction
      )
      if (actionIndex > -1) {
        actionKey = Object.keys(PermissionAction)[actionIndex]
      }
      const typeIndex = Object.values(PermissionType).indexOf(
        permissionStr.replace(action, '%s') as PermissionType
      )
      if (typeIndex > -1) {
        typeKey = Object.keys(PermissionType)[typeIndex]
      }
    }

    return { actionKey, typeKey }
  }
}
