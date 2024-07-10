import { Component, Input } from '@angular/core'
import { tag } from 'src/app/data/tag'

@Component({
  selector: 'pngx-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss'],
})
export class TagComponent {
  constructor() {}

  @Input()
  tag: tag

  @Input()
  linkTitle: string = ''

  @Input()
  clickable: boolean = false
}
