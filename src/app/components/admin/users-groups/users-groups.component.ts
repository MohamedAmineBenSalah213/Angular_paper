import { Component, OnDestroy, OnInit } from '@angular/core'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { Subject, first, takeUntil } from 'rxjs'
import { group } from 'src/app/data/group'
import { User } from 'src/app/data/user'
import { PermissionsService } from 'src/app/services/permissions.service'
import { groupService } from 'src/app/services/rest/group.service'
import { UserService } from 'src/app/services/rest/user.service'
import { ToastService } from 'src/app/services/toast.service'
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component'
import { EditDialogMode } from '../../common/edit-dialog/edit-dialog.component'
import { GroupEditDialogComponent } from '../../common/edit-dialog/group-edit-dialog/group-edit-dialog.component'
import { UserEditDialogComponent } from '../../common/edit-dialog/user-edit-dialog/user-edit-dialog.component'
import { ComponentWithPermissions } from '../../with-permissions/with-permissions.component'
import { SettingsService } from 'src/app/services/settings.service'
import { Results } from 'src/app/data/results'

@Component({
  selector: 'pngx-users-groups',
  templateUrl: './users-groups.component.html',
  styleUrls: ['./users-groups.component.scss'],
})
export class UsersAndGroupsComponent
  extends ComponentWithPermissions
  implements OnInit, OnDestroy
{
  users: User[]
  groups: group[]

  unsubscribeNotifier: Subject<any> = new Subject()

  constructor(
    private usersService: UserService,
    private groupsService: groupService,
    private toastService: ToastService,
    private modalService: NgbModal,
    public permissionsService: PermissionsService,
    private settings: SettingsService
  ) {
    super()
  }

  ngOnInit(): void {
    this.usersService
      .listAllCustom("list_user")
      .pipe(first(), takeUntil(this.unsubscribeNotifier))
      .subscribe({
        next: (r) => {
          this.users = r.results
          console.log(this.users.forEach(e=> console.log(
           e.username +" "+e.normalizedUserName)));
          
        },
        error: (e) => {
          this.toastService.showError($localize`Error retrieving users`, e)
        },
      })

    this.groupsService
       .listAllCustom("list_groups")
      .pipe(first(), takeUntil(this.unsubscribeNotifier))
      .subscribe({
        next: (r) => {
          this.groups = r.results
        },
        error: (e) => {
          this.toastService.showError($localize`Error retrieving groups`, e)
        },
      }) 
  }

  ngOnDestroy() {
    this.unsubscribeNotifier.next(true)
  }

  editUser(user: User) {
    var modal = this.modalService.open(UserEditDialogComponent, {
      backdrop: 'static',
      size: 'xl',
    })
    modal.componentInstance.dialogMode = user
      ? EditDialogMode.EDIT
      : EditDialogMode.CREATE
    modal.componentInstance.object = user
    modal.componentInstance.succeeded
      .pipe(takeUntil(this.unsubscribeNotifier))
      .subscribe((newUser: User) => {
        if (
          newUser.id === this.settings.currentUser.id &&
          (modal.componentInstance as UserEditDialogComponent).passwordIsSet
        ) {
          this.toastService.showInfo(
            $localize`Password has been changed, you will be logged out momentarily.`
          )
          setTimeout(() => {
            window.location.href = `${window.location.origin}/accounts/logout/?next=/accounts/login/`
          }, 2500)
        } else {
          this.toastService.showInfo(
            $localize`Saved user "${newUser.email}".`
          )
          this.usersService.listAll().subscribe((r) => {
            this.users = r.results
          })
        }
      })
    modal.componentInstance.failed
      .pipe(takeUntil(this.unsubscribeNotifier))
      .subscribe((e) => {
        this.toastService.showError($localize`Error saving user.`, e)
      })
  }

  deleteUser(user: User) {
    let modal = this.modalService.open(ConfirmDialogComponent, {
      backdrop: 'static',
    })
    modal.componentInstance.title = $localize`Confirm delete user account`
    modal.componentInstance.messageBold = $localize`This operation will permanently delete this user account.`
    modal.componentInstance.message = $localize`This operation cannot be undone.`
    modal.componentInstance.btnClass = 'btn-danger'
    modal.componentInstance.btnCaption = $localize`Proceed`
    modal.componentInstance.confirmClicked.subscribe(() => {
      modal.componentInstance.buttonsEnabled = false
      this.usersService.delete(user,"delete_user").subscribe({
        next: () => {
          modal.close()
          this.toastService.showInfo($localize`Deleted user`)
          this.usersService.listAllCustom("list_user").subscribe((r) => {
            this.users = r.results
          })
        },
        error: (e) => {
          this.toastService.showError($localize`Error deleting user.`, e)
        },
      })
    })
  }

  editGroup(group: group = null) {
    var modal = this.modalService.open(GroupEditDialogComponent, {
      backdrop: 'static',
      size: 'lg',
    })
    modal.componentInstance.dialogMode = group
      ? EditDialogMode.EDIT
      : EditDialogMode.CREATE
    modal.componentInstance.object = group
    modal.componentInstance.succeeded
      .pipe(takeUntil(this.unsubscribeNotifier))
      .subscribe((newGroup) => {
        this.toastService.showInfo($localize`Saved group "${newGroup.name}".`)
        this.groupsService.listAll().subscribe((r) => {
          this.groups = r.results
        })
      })
    modal.componentInstance.failed
      .pipe(takeUntil(this.unsubscribeNotifier))
      .subscribe((e) => {
        this.toastService.showError($localize`Error saving group.`, e)
      })
  }

  /* deleteGroup(group: group) {
    let modal = this.modalService.open(ConfirmDialogComponent, {
      backdrop: 'static',
    })
    modal.componentInstance.title = $localize`Confirm delete user group`
    modal.componentInstance.messageBold = $localize`This operation will permanently delete this user group.`
    modal.componentInstance.message = $localize`This operation cannot be undone.`
    modal.componentInstance.btnClass = 'btn-danger'
    modal.componentInstance.btnCaption = $localize`Proceed`
    modal.componentInstance.confirmClicked.subscribe(() => {
      modal.componentInstance.buttonsEnabled = false
      this.groupsService.delete(group).subscribe({
        next: () => {
          modal.close()
          this.toastService.showInfo($localize`Deleted group`)
          this.groupsService.listAll().subscribe((r) => {
            this.groups = r.results
          })
        },
        error: (e) => {
          this.toastService.showError($localize`Error deleting group.`, e)
        },
      })
    }) 
  }*/
    deleteGroup(group: group) {
      let modal = this.modalService.open(ConfirmDialogComponent, {
        backdrop: 'static',
      });
      modal.componentInstance.title = $localize`Confirm delete user group`;
      modal.componentInstance.messageBold = $localize`This operation will permanently delete this user group.`;
      modal.componentInstance.message = $localize`This operation cannot be undone.`;
      modal.componentInstance.btnClass = 'btn-danger';
      modal.componentInstance.btnCaption = $localize`Proceed`;
      modal.componentInstance.confirmClicked.subscribe(() => {
        modal.componentInstance.buttonsEnabled = false;
        this.groupsService.delete(group, 'delete_group').subscribe({
          next: () => {
            modal.close();
            this.toastService.showInfo($localize`Deleted group`);
            this.groupsService.listAllCustom("list_groups").subscribe((r) => {
              this.groups = r.results;
            });
          },
          error: (e) => {
            this.toastService.showError($localize`Error deleting group.`, e);
          },
        });
      });
    }

  getGroupName(id: string): string {
    return this.groups?.find((g) => g.id === id)?.name ?? ''
  }
}
