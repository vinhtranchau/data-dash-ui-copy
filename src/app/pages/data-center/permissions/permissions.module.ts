import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableModule } from '../../../ui-kit/table/table.module';
import { DialogModule } from '../../../ui-kit/dialog/dialog.module';
import { FormKitModule } from '../../../ui-kit/form-kit/form-kit.module';

import { PermissionsRoutingModule } from './permissions-routing.module';

import { PermissionsComponent } from './permissions.component';
import { PermissionEditDialogComponent } from './permission-edit-dialog/permission-edit-dialog.component';

@NgModule({
  declarations: [PermissionsComponent, PermissionEditDialogComponent],
  imports: [CommonModule, PermissionsRoutingModule, DialogModule, TableModule, FormKitModule],
})
export class PermissionsModule {
}
