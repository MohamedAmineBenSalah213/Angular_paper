import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, switchMap } from 'rxjs'
import { group } from 'src/app/data/group'
import { PermissionsService } from '../permissions.service'
import { AbstractNameFilterService } from './abstract-name-filter-service'

@Injectable({
  providedIn: 'root',
})
export class groupService extends AbstractNameFilterService<group> {
  constructor(
    http: HttpClient,
    private permissionService: PermissionsService
  ) {
    super(http, 'group')
  }

  update(o: group): Observable<group> {
    return this.getCached(o.id,"group_list").pipe(
      switchMap((initialgroup) => {
        initialgroup.permissions?.forEach((perm) => {
          const { typeKey, actionKey } =
            this.permissionService.getPermissionKeys(perm)
          if (!typeKey || !actionKey) {
            // dont lose permissions the UI doesnt use
            o.permissions.push(perm)
          }
        })
        return super.update(o)
      })
    )
  }
}
