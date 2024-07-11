import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { consumptionTemplate } from 'src/app/data/consumption-template';
import { AbstractService } from './abstract-service';
import { PermissionsService } from '../permissions.service';

@Injectable({
  providedIn: 'root',
})
export class ConsumptionTemplateService extends AbstractService<consumptionTemplate> {
  loading: boolean;

  constructor(http: HttpClient, private permissionservice: PermissionsService) {
    super(http, 'template');
  }

  public reload() {
    this.loading = true;
    this.listAllCustom('list_templates').subscribe((r) => {
      this.templates = r.results;
      this.loading = false;
    });
  }

  private templates: consumptionTemplate[] = [];

  public get allTemplates(): consumptionTemplate[] {
    return this.templates;
  }

  create(o: consumptionTemplate) {
    o.owner = this.permissionservice.getCurrentUserID();
    return super.create(o, 'add_template').pipe(tap(() => this.reload()));
  }

  update(o: consumptionTemplate) {
    o.owner = this.permissionservice.getCurrentUserID();
    return super.update(o, 'update_template').pipe(tap(() => this.reload()));
  }

  delete(o: consumptionTemplate) {
    return super.delete(o, 'delete_template').pipe(tap(() => this.reload()));
  }
}
