import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { documentType } from 'src/app/data/document-type'
import { AbstractNameFilterService } from './abstract-name-filter-service'

@Injectable({
  providedIn: 'root',
})
export class DocumentTypeService extends AbstractNameFilterService<documentType> {
  constructor(http: HttpClient) {
    super(http, 'documenttype')
  }
}
