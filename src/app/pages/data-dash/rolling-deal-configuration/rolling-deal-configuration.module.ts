import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableModule } from '../../../ui-kit/table/table.module';
import { DialogModule } from '../../../ui-kit/dialog/dialog.module';
import { FormKitModule } from '../../../ui-kit/form-kit/form-kit.module';
import { SpinnerModule } from '../../../ui-kit/spinner/spinner.module';

import { RollingDealConfigurationRoutingModule } from './rolling-deal-configuration-routing.module';
import { RollingDealConfigurationComponent } from './rolling-deal-configuration.component';
import { RollingDealConfigurationEditDialogComponent } from './rolling-deal-configuration-edit-dialog/rolling-deal-configuration-edit-dialog.component';

@NgModule({
  declarations: [RollingDealConfigurationComponent, RollingDealConfigurationEditDialogComponent],
  imports: [
    CommonModule,
    RollingDealConfigurationRoutingModule,
    TableModule,
    DialogModule,
    FormKitModule,
    SpinnerModule,
  ],
})
export class RollingDealConfigurationModule {}
