import { Component, forwardRef, Input, OnInit } from '@angular/core'
import { NG_VALUE_ACCESSOR } from '@angular/forms'
import { first } from 'rxjs/operators'
import { group } from 'src/app/data/group'
import { groupService } from 'src/app/services/rest/group.service'
import { AbstractInputComponent } from '../../abstract-input'

@Component({
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PermissionsGroupComponent),
      multi: true,
    },
  ],
  selector: 'pngx-permissions-group',
  templateUrl: './permissions-group.component.html',
  styleUrls: ['./permissions-group.component.scss'],
})
export class PermissionsGroupComponent extends AbstractInputComponent<group> {
  groups: group[]

  constructor(groupService: groupService) {
    super()
    groupService
      .listAllCustom("list_groups")
      .pipe(first())
      .subscribe((result) => (this.groups = result.results))
  }
}
