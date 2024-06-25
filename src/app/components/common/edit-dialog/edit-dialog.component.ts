import { Directive, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { Observable } from 'rxjs'
import {
  MATCHING_ALGORITHMS,
  MATCH_AUTO,
  MATCH_NONE,
} from 'src/app/data/matching-model'
import { ObjectWithId } from 'src/app/data/object-with-id'
import { ObjectWithPermissions } from 'src/app/data/object-with-permissions'
import { PaperlessUser } from 'src/app/data/paperless-user'
import { AbstractPaperlessService } from 'src/app/services/rest/abstract-paperless-service'
import { UserService } from 'src/app/services/rest/user.service'
import { PermissionsFormObject } from '../input/permissions/permissions-form/permissions-form.component'
import { SettingsService } from 'src/app/services/settings.service'
import { SETTINGS_KEYS } from 'src/app/data/paperless-uisettings'

export enum EditDialogMode {
  CREATE = 0,
  EDIT = 1,
}

@Directive()
export abstract class EditDialogComponent<
  T extends /* ObjectWithPermissions | */ ObjectWithId,
> implements OnInit
{
  constructor(
    protected service: AbstractPaperlessService<T>,
    private activeModal: NgbActiveModal,
    private userService: UserService,
    private settingsService: SettingsService,
   
  ) {}

  users: PaperlessUser[]

  @Input()
  dialogMode: EditDialogMode = EditDialogMode.CREATE

  @Input()
  object: T

  @Output()
  succeeded = new EventEmitter()

  @Output()
  failed = new EventEmitter()

  networkActive = false

  closeEnabled = false

  error = null

  abstract getForm(): FormGroup

  objectForm: FormGroup = this.getForm()

  ngOnInit(): void {
     if (this.object != null) {
      if (this.object['permissions']) {
        //debugger
        console.log(this.object['permissions']);
        
        this.object['user_permissions'] = this.object['permissions']
      }

      this.object['permissions_form'] = {
        owner: (this.object as ObjectWithPermissions).owner,
        set_permissions: (this.object as ObjectWithPermissions).permissions,
      }
      
      this.objectForm.patchValue(this.object)
      console.log(this.objectForm);
      
    } else {
      // defaults from settings
      this.objectForm.patchValue({
        permissions_form: {
          owner: this.settingsService.get(SETTINGS_KEYS.DEFAULT_PERMS_OWNER),
          set_permissions: {
            view: {
              users: this.settingsService.get(
                SETTINGS_KEYS.DEFAULT_PERMS_VIEW_USERS
              ),
              groups: this.settingsService.get(
                SETTINGS_KEYS.DEFAULT_PERMS_VIEW_GROUPS
              ),
            },
            change: {
              users: this.settingsService.get(
                SETTINGS_KEYS.DEFAULT_PERMS_EDIT_USERS
              ),
              groups: this.settingsService.get(
                SETTINGS_KEYS.DEFAULT_PERMS_EDIT_GROUPS
              ),
            },
          },
        },
      })
    }

    // wait to enable close button so it doesnt steal focus from input since its the first clickable element in the DOM
    setTimeout(() => {
      this.closeEnabled = true
    })

    this.userService.listAllCustom("list_user").subscribe((r) => {
      this.users = r.results
    }) 
  }

  getCreateTitle() {
    return $localize`Create new item`
  }

  getEditTitle() {
    return $localize`Edit item`
  }

  getTitle() {
    switch (this.dialogMode) {
      case EditDialogMode.CREATE:
        return this.getCreateTitle()
      case EditDialogMode.EDIT:
        return this.getEditTitle()
      default:
        break
    }
  }

  getMatchingAlgorithms() {
    return MATCHING_ALGORITHMS
  }

  get patternRequired(): boolean {
    return (
      this.objectForm?.value.matching_algorithm !== MATCH_AUTO &&
      this.objectForm?.value.matching_algorithm !== MATCH_NONE
    )
  }
   abstract getAction()
   abstract getActionupdate()
   splitIntoList(input: string): string[] {
    // Remove spaces and commas from the input string
   // let cleanedInput = input.replace(/[,\s]+/g, '');
 
    // Split the cleaned input into words based on word boundaries
  let words = input.split(/\s+/).filter(word => word !== '' && word !== ',');
 
    return words;
}
  save() {
   // debugger
    this.error = null
     const formValues = Object.assign({}, this.objectForm.value)
    const permissionsObject: PermissionsFormObject =
      this.objectForm.get('permissions_form')?.value
    if (permissionsObject) {
      formValues.owner = permissionsObject.owner
      formValues.set_permissions = permissionsObject.set_permissions
      delete formValues.permissions_form
    }  

    var newObject = Object.assign(Object.assign({}, this.object), formValues)
    console.log(newObject);

  if(newObject?.set_permissions){

    newObject.set_permissions.view.users=
                               newObject.set_permissions.view.users.length>0?
                               newObject.set_permissions.view.users.map(user => user.id):[];
    newObject.set_permissions.change.users=
                                 newObject.set_permissions.change.users.length>0?
                                 newObject.set_permissions.change.users.map(user => user.id):[];
    newObject.set_permissions.view.groups=
                                   newObject.set_permissions.view.groups.length>0?
                                   newObject.set_permissions.view.groups.map(group => group.id):[];
    newObject.set_permissions.change.groups= 
                                   newObject.set_permissions.change.groups.length>0?
                                  newObject.set_permissions.change.groups.map(group => group.id):[];
  }
    var serverResponse: Observable<T>
    console.log("this.dialogMode",this.dialogMode)
    switch (this.dialogMode) {
      case EditDialogMode.CREATE:
       // debugger
         if (newObject.matching_algorithm== MATCH_AUTO){
           if(newObject.ExtractedData)
            {
              console.log(newObject.ExtractedData);
              
            }
          newObject.DocumentTags = [];
          
          serverResponse = this.service.create(newObject,this.getAction())
        } 

        if(newObject.matching_algorithm in MATCHING_ALGORITHMS && newObject.matching_algorithm!= MATCH_AUTO ){
          if(newObject.match!=""){
          newObject.match = this.splitIntoList(newObject.match); 
          console.log(newObject.match) 
          }
          else
           newObject.match=[]
         
        console.log(newObject);
        
        serverResponse = this.service.create(newObject,this.getAction())
        }
        else{
          serverResponse = this.service.create(newObject,this.getAction())
        } 
        console.log("newObject",newObject);
        console.log(serverResponse)
        break
      case EditDialogMode.EDIT:
       // debugger
        if(newObject.matching_algorithm in MATCHING_ALGORITHMS && newObject.matching_algorithm!= MATCH_NONE){
            if(newObject.match){
            newObject.match = this.splitIntoList(newObject.match); 
            }
          
        
        console.log(this.getActionupdate())
        serverResponse = this.service.update(newObject,this.getActionupdate())
        }
        if(newObject.matching_algorithm== MATCH_NONE){
          newObject.match= [];
           console.log(this.getActionupdate())
          serverResponse = this.service.update(newObject,this.getActionupdate())
        }
        else{
          console.log("this.getActionupdate()",this.getActionupdate())
          serverResponse = this.service.update(newObject,this.getActionupdate())
        }
      default:
        break
    }
    this.networkActive = true
    serverResponse.subscribe({
      next: (result) => {
        this.activeModal.close()
        this.succeeded.emit(result)
      },
      error: (error) => {
        this.error = error.error
        this.networkActive = false
        this.failed.next(error)
      },
    })
  }

  cancel() {
    this.activeModal.close()
  }
}
