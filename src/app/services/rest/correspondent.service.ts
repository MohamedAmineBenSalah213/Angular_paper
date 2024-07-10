import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { correspondent } from 'src/app/data/correspondent'
import { AbstractNameFilterService } from './abstract-name-filter-service'

@Injectable({
  providedIn: 'root',
})
export class CorrespondentService extends AbstractNameFilterService<correspondent> {
  constructor(http: HttpClient) {
    super(http, 'correspondents')
  }
}
