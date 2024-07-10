import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { tag } from 'src/app/data/tag'
import { AbstractNameFilterService } from './abstract-name-filter-service'

@Injectable({
  providedIn: 'root',
})
export class TagService extends AbstractNameFilterService<tag> {
  constructor(http: HttpClient) {
    super(http, 'tag')
  }
}
