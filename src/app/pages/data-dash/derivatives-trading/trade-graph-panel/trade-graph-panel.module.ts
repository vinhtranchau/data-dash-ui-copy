import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SpinnerModule } from '../../../../ui-kit/spinner/spinner.module';

import { TradeGraphPanelComponent } from './trade-graph-panel.component';
import { GraphKitModule } from '../../../../ui-kit/graph-kit/graph-kit.module';
import { ErrorHandlerModule } from '../../../../ui-kit/error-handler/error-handler.module';

@NgModule({
  declarations: [TradeGraphPanelComponent],
  imports: [CommonModule, SpinnerModule, GraphKitModule, ErrorHandlerModule],
  exports: [TradeGraphPanelComponent],
})
export class TradeGraphPanelModule {}
