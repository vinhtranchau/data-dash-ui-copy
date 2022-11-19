import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormKitModule } from '../../../../ui-kit/form-kit/form-kit.module';
import { ErrorHandlerModule } from '../../../../ui-kit/error-handler/error-handler.module';
import { SpinnerModule } from '../../../../ui-kit/spinner/spinner.module';

import { DealConfiguratorPanelModule } from './deal-configurator-panel/deal-configurator-panel.module';

import { GenerateStrategyPageComponent } from './generate-strategy-page.component';

import { HedgingControlsPanelComponent } from './hedging-controls-panel/hedging-controls-panel.component';
import { FinishDialogComponent } from './finish-dialog/finish-dialog.component';

@NgModule({
  declarations: [GenerateStrategyPageComponent, HedgingControlsPanelComponent, FinishDialogComponent],
  imports: [CommonModule, FormKitModule, ErrorHandlerModule, SpinnerModule, DealConfiguratorPanelModule],
  exports: [GenerateStrategyPageComponent],
})
export class GenerateStrategyPageModule {}
