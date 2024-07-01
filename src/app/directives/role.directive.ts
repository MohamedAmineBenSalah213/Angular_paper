import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { PermissionsService } from '../services/permissions.service';

@Directive({
  selector: '[Role]'
})
export class RoleDirective implements OnInit {
  @Input() Role: string;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private permissionsService: PermissionsService
  ) {}

  ngOnInit(): void {
    const requiredRole = this.Role;
    const userRole = this.permissionsService.getCurrentUserRole();

    if (requiredRole === userRole) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainerRef.clear();
    }
  }
}
