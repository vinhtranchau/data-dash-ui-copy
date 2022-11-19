import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableModule } from '../../../ui-kit/table/table.module';
import { DialogModule } from '../../../ui-kit/dialog/dialog.module';
import { FormKitModule } from '../../../ui-kit/form-kit/form-kit.module';

import { UnitsRoutingModule } from './units-routing.module';

import { UnitsComponent } from './units.component';
import { UnitEditDialogComponent } from './unit-edit-dialog/unit-edit-dialog.component';

@NgModule({
  declarations: [UnitsComponent, UnitEditDialogComponent],
  imports: [CommonModule, UnitsRoutingModule, DialogModule, TableModule, FormKitModule],
})
export class UnitsModule {}
