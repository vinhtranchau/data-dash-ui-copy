import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableModule } from '../../../ui-kit/table/table.module';
import { DialogModule } from '../../../ui-kit/dialog/dialog.module';
import { FormKitModule } from '../../../ui-kit/form-kit/form-kit.module';

import { UsersRoutingModule } from './users-routing.module';

import { UsersComponent } from './users.component';
import { UserEditDialogComponent } from './user-edit-dialog/user-edit-dialog.component';

@NgModule({
  declarations: [UsersComponent, UserEditDialogComponent],
  imports: [CommonModule, TableModule, DialogModule, FormKitModule, UsersRoutingModule],
})
export class UsersModule {
}
