import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableModule } from '../../../ui-kit/table/table.module';
import { DialogModule } from '../../../ui-kit/dialog/dialog.module';
import { FormKitModule } from '../../../ui-kit/form-kit/form-kit.module';

import { CurrencyRoutingModule } from './currency-routing.module';

import { CurrencyComponent } from './currency.component';
import { CurrencyEditDialogComponent } from './currency-edit-dialog/currency-edit-dialog.component';

@NgModule({
  declarations: [CurrencyComponent, CurrencyEditDialogComponent],
  imports: [CommonModule, CurrencyRoutingModule, DialogModule, TableModule, FormKitModule],
})
export class CurrencyModule {}
