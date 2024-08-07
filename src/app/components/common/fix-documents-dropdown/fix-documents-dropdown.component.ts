import { Component, Input, OnInit } from '@angular/core';
import { Subject, first, map, switchMap, takeUntil } from 'rxjs';
import { correspondent } from 'src/app/data/correspondent';
import { documentSuggestions } from 'src/app/data/document-suggestions';
import { CorrespondentService } from 'src/app/services/rest/correspondent.service';
import { CorrespondentEditDialogComponent } from '../edit-dialog/correspondent-edit-dialog/correspondent-edit-dialog.component';
import { EditDialogMode } from '../edit-dialog/edit-dialog.component';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/data/user';
import { UserService } from 'src/app/services/rest/user.service';
import { task } from 'src/app/data/task';
import { DocumentService } from 'src/app/services/rest/document.service';
import { ToastService } from 'src/app/services/toast.service';
import { FixOwnerCorrespondent } from 'src/app/data/FixOwnerCorrespondent';
import { TasksService } from 'src/app/services/tasks.service';

@Component({
  selector: 'pngx-fix-documents-dropdown',
  templateUrl: './fix-documents-dropdown.component.html',
  styleUrls: ['./fix-documents-dropdown.component.scss']
})
export class FixDocumentsDropdownComponent implements OnInit {
  correspondents: correspondent[]
  owners : User[]
  suggestions: documentSuggestions;
  @Input() task: task;
  unsubscribeNotifier: Subject<any> = new Subject()
  selectedCorrespondent: any;  // Property to hold the selected correspondent
  selectedOwner: any;  // Property to hold the selected owner

  constructor(
  private correspondentService: CorrespondentService,
  private usersService: UserService,
  private activeModal: NgbActiveModal,
  private documentsService: DocumentService,
  public tasksService: TasksService,
  private toastService: ToastService,
)
  
  {

  }

  ngOnInit(): void {
    console.log(this.task);
  

  this.correspondentService
  .listAll(null,null,"list_correspondent",null)
  .pipe(first(), takeUntil(this.unsubscribeNotifier))
  .subscribe((result) => (this.correspondents = result.results))

  this.usersService
  .listAllCustom("list_user")
  .pipe(first(), takeUntil(this.unsubscribeNotifier))
  .subscribe({
    next: (r) => {
      this.owners = r.results
      console.log(this.owners.forEach(e=> console.log(
       e.username +" "+e.normalizedUserName)));
      
    }
  })
  }
  @Input()
  documentId: number
  cancel() {
    this.activeModal.close()
  }
  save(id:string){
    const dataToSave: FixOwnerCorrespondent = {
      correspondentId: this.selectedCorrespondent,
      ownerId: this.selectedOwner

    };
    this.documentsService.fixOwnerCorrespondent(id,dataToSave).pipe(first())
    .subscribe({
      next: () => {
        
        this.toastService.showInfo($localize`Document saved successfully.`)
        this.activeModal.close()
        this.tasksService.reload()
      },
      error: (error) =>{
        this.toastService.showError($localize`Error saving document`, error)
      }
    }
      )
  }
}
