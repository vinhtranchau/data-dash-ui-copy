import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableModule } from '../../../ui-kit/table/table.module';
import { DialogModule } from '../../../ui-kit/dialog/dialog.module';
import { FormKitModule } from '../../../ui-kit/form-kit/form-kit.module';

import { NationRoutingModule } from './nation-routing.module';

import { NationComponent } from './nation.component';
import { NationEditDialogComponent } from './nation-edit-dialog/nation-edit-dialog.component';

@NgModule({
  declarations: [NationComponent, NationEditDialogComponent],
  imports: [CommonModule, NationRoutingModule, DialogModule, TableModule, FormKitModule],
})
export class NationModule {
}
