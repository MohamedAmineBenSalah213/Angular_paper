import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { combineLatest, Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { mailRule } from 'src/app/data/mail-rule'
import { AbstractService } from './abstract-service'
import { PermissionsService } from '../permissions.service'

@Injectable({
  providedIn: 'root',
})
export class MailRuleService extends AbstractService<mailRule> {
  loading: boolean

  constructor(http: HttpClient , private PermissionService : PermissionsService) {
    super(http, 'mailrule')
  }
  private reload() {
    this.loading = true
    this.listAllCustom("list_mailrule").subscribe((r) => {
      this.mailRules = r.results
      this.loading = false
    })
  }

  private mailRules: mailRule[] = []

  get allRules() {
    return this.mailRules
  }
  
  create(o: mailRule) {
    o.owner = this.PermissionService.getCurrentUserID();
    return super.create(o,"add_mailrule").pipe(tap(() => this.reload()))
  }

  update(o: mailRule) {
    o.owner = this.PermissionService.getCurrentUserID();
    return super.update(o,"update_mailrule").pipe(tap(() => this.reload()))
  }

  patchMany(objects: mailRule[]): Observable<mailRule[]> {
    return combineLatest(objects.map((o) => super.patch(o))).pipe(
      tap(() => this.reload())
    )
  }

  delete(o: mailRule) {
    return super.delete(o,"delete_mailrule").pipe(tap(() => this.reload()))
  }
}
