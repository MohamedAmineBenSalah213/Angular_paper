import { Pipe, PipeTransform } from '@angular/core'
import { UserService } from '../services/rest/user.service'
import {
  PermissionAction,
  PermissionType,
  PermissionsService,
} from '../services/permissions.service'


@Pipe({
  name: 'username',
})
export class UsernamePipe implements PipeTransform {
  transform(value: any, ...args: any[]) {
    throw new Error('Method not implemented.')
  }
  /* users: User[]

  constructor(
    permissionsService: PermissionsService,
    userService: UserService
  ) {
    if (
      permissionsService.currentUserCan(
        PermissionAction.View,
        PermissionType.User
      )
    ) {
      userService.listAll().subscribe((r) => (this.users = r.results))
    }
  } */

 /*  transform(userID: string): string {
    return this.users
      ? this.getName(this.users.find((u) => u.id === userID)) ?? ''
      : $localize`Shared`
  } */
/* 
  getName(user: User): string {
    if (!user) return ''
    const name = [user.first_name, user.last_name].join(' ')
    if (name.length > 1) return name.trim()
    return user.userName
  } */
}
