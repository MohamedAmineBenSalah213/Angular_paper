import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { combineLatest, Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { MailAccount } from 'src/app/data/mail-account'
import { AbstractService } from './abstract-service'

@Injectable({
  providedIn: 'root',
})
export class MailAccountService extends AbstractService<MailAccount> {
  loading: boolean

  constructor(http: HttpClient) {
    super(http, 'mailaccount')
  }

  private reload() {
    this.loading = true
    this.listAll(null, null, "list_mailaccount",null).subscribe((r) => {
      this.mailAccounts = r.results
      this.loading = false
    })
  }

  private mailAccounts: MailAccount[] = []

  get allAccounts() {
    return this.mailAccounts
  }

  create(o: MailAccount) {
    return super.create(o,"add_mailaccount").pipe(tap(() => this.reload()))
  }

  update(o: MailAccount) {
    return super.update(o,"update_mailaccount").pipe(tap(() => this.reload()))
  }

  patchMany(
    objects: MailAccount[]
  ): Observable<MailAccount[]> {
    return combineLatest(objects.map((o) => super.patch(o))).pipe(
      tap(() => this.reload())
    )
  }

  delete(o: MailAccount) {
    return super.delete(o,"delete_mailaccount").pipe(tap(() => this.reload()))
  }

  test(o: MailAccount) {
    const account = Object.assign({}, o)
    delete account['set_permissions']
    return this.http.post(this.getResourceUrl() + 'test/', account)
  }
}
