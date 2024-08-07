/* import { Component, Input, Output, EventEmitter } from '@angular/core'
import { DocumentNotesService } from 'src/app/services/rest/document-notes.service'
import { DocumentNote } from 'src/app/data/-document-note'
import { FormControl, FormGroup } from '@angular/forms'
import { ToastService } from 'src/app/services/toast.service'
import { ComponentWithPermissions } from '../with-permissions/with-permissions.component'
import { UserService } from 'src/app/services/rest/user.service'
import { User } from 'src/app/data/-user'

@Component({
  selector: 'pngx-document-notes',
  templateUrl: './document-notes.component.html',
  styleUrls: ['./document-notes.component.scss'],
})
export class DocumentNotesComponent extends ComponentWithPermissions {
  noteForm: FormGroup = new FormGroup({
    newNote: new FormControl(''),
  })
  
  networkActive = false
  newNoteError: boolean = false

  @Input()
  documentId: string

  @Input()
  notes: DocumentNote[] = []

  @Input()
  addDisabled: boolean = false

  @Output()
  updated: EventEmitter<DocumentNote[]> = new EventEmitter()
  users: User[]

  constructor(
    private notesService: DocumentNotesService,
    private toastService: ToastService,
    private usersService: UserService
  ) {
    super()
    this.usersService
    .listAllCustom("list_user").subscribe({
      next: (users) => {
        this.users = users.results
      },
    }) 
  }

  addNote() {
    const note: string = this.noteForm.get('newNote').value.toString().trim()
    if (note.length == 0) {
      this.newNoteError = true
      return
    }
    this.newNoteError = false
    this.networkActive = true
    this.notesService.addNote(this.documentId, note).subscribe({
      next: (result) => {
        this.notes = result
        this.noteForm.get('newNote').reset()
        this.networkActive = false
        this.updated.emit(this.notes)
        
      },
      error: (e) => {
        this.networkActive = false
        this.toastService.showError($localize`Error saving note`, e)
      },
    })
  }

  deleteNote(noteId: string) {
    this.notesService.deleteNote(this.documentId, noteId).subscribe({
      next: (result) => {
        this.notes = result
        this.networkActive = false
        this.updated.emit(this.notes)
      },
      error: (e) => {
        this.networkActive = false
        this.toastService.showError($localize`Error deleting note`, e)
      },
    })
  }

  displayName(note: DocumentNote): string {
    if (!note.user) return ''
    const user = this.users?.find((u) => u.id === note.user)
    if (!user) return ''
    //debugger
    const nameComponents = []
    if (user.email) nameComponents.push(user.email)
    /* if (user.last_name) nameComponents.push(user.last_name)
    if (user.username) {
      if (nameComponents.length > 0) nameComponents.push(`(${user.username})`)
      else nameComponents.push(user.username)
    } 
    return nameComponents.join(' ')
    
  }

  noteFormKeydown(event: KeyboardEvent) {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      this.addNote()
    }
  }
}
 */
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { documentNotesService } from 'src/app/services/rest/document-notes.service';
import { documentNote } from 'src/app/data/document-note';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastService } from 'src/app/services/toast.service';
import { ComponentWithPermissions } from '../with-permissions/with-permissions.component';
import { UserService } from 'src/app/services/rest/user.service';
import { User } from 'src/app/data/user';

@Component({
  selector: 'pngx-document-notes',
  templateUrl: './document-notes.component.html',
  styleUrls: ['./document-notes.component.scss'],
})
export class DocumentNotesComponent extends ComponentWithPermissions {
  noteForm: FormGroup = new FormGroup({
    newNote: new FormControl(''),
  });

  networkActive = false;
  newNoteError: boolean = false;

  @Input()
  documentId: string;

  @Input()
  notes: documentNote[] = [];

  @Input()
  addDisabled: boolean = false;

  @Output()
  updated: EventEmitter<documentNote[]> = new EventEmitter();
  
  users: User[];

  constructor(
    private notesService: documentNotesService,
    private toastService: ToastService,
    private usersService: UserService
  ) {
    super();
    this.usersService
    .listAllCustom("list_user").subscribe({
      next: (users) => {
        this.users = users.results
      },
    }) 
  }

  addNote() {
    const note: string = this.noteForm.get('newNote').value.toString().trim();
    if (note.length === 0) {
      this.newNoteError = true;
      return;
    }
    this.newNoteError = false;
    this.networkActive = true;
    this.notesService.addNote(this.documentId, note).subscribe({
      next: (result) => {
        this.notes.push(result); 
        this.noteForm.get('newNote').reset();
        this.networkActive = false;
        this.updated.emit(this.notes);
      },
      error: (e) => {
        this.networkActive = false;
        this.toastService.showError($localize`Error saving note`, e);
      },
    });
  }

  deleteNote(noteId: string) {
    this.notesService.deleteNote(this.documentId, noteId).subscribe({
      next: (result) => {
        this.notes = this.notes.filter(note => note.id !== noteId); // Assuming result is an array of DocumentNote
        this.networkActive = false;
        this.updated.emit(this.notes);
      },
      error: (e) => {
        this.networkActive = false;
        this.toastService.showError($localize`Error deleting note`, e);
      },
    });
  }

  displayName(note: documentNote): string {
    if (!note.user) return '';
    const user = this.users?.find((u) => u.id === note.user);
    if (!user) return '';

    const nameComponents = [];
    if (user.email) nameComponents.push(user.email);
    return nameComponents.join(' ');
  }

  noteFormKeydown(event: KeyboardEvent) {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      this.addNote();
    }
  }
}
