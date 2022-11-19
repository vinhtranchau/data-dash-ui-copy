import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

import { SpinnerModule } from '../../../../ui-kit/spinner/spinner.module';

import { TradeHistoryPanelComponent } from './trade-history-panel.component';

@NgModule({
  declarations: [TradeHistoryPanelComponent],
  imports: [CommonModule, MatButtonModule, SpinnerModule],
  exports: [TradeHistoryPanelComponent],
})
export class TradeHistoryPanelModule {}
