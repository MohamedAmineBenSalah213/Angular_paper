import { Injectable } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { AbstractService } from './abstract-service'
import { Observable } from 'rxjs'

import { CustomFieldInstance } from 'src/app/data/custom-field-instance'
import { customField } from 'src/app/data/custom-field'

@Injectable({
  providedIn: 'root',
})
export class CustomFieldsService extends AbstractService<customField> {
  constructor(http: HttpClient) {
    super(http, 'customfield')
  }
}
