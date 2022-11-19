import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableModule } from '../../../ui-kit/table/table.module';
import { DialogModule } from '../../../ui-kit/dialog/dialog.module';
import { FormKitModule } from '../../../ui-kit/form-kit/form-kit.module';
import { UploaderModule } from '../../../ui-kit/uploader/uploader.module';
import { HistoricalDataComponent } from './historical-data.component';

import { HistoricalDataRoutingModule } from './historical-data-routing.module';
import { HistoricalDataEditDialogComponent } from './historical-data-edit-dialog/historical-data-edit-dialog.component';


@NgModule({
  declarations: [HistoricalDataComponent, HistoricalDataEditDialogComponent],
  imports: [CommonModule, HistoricalDataRoutingModule, DialogModule.forRoot(), TableModule, FormKitModule, UploaderModule],
})
export class HistoricalDataModule {
}
