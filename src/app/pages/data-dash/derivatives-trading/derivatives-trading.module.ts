import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DerivativesTradingRoutingModule } from './derivatives-trading-routing.module';

import { TradeAbleInstrumentsPanelModule } from './trade-able-instruments-panel/trade-able-instruments-panel.module';
import { TradeGraphPanelModule } from './trade-graph-panel/trade-graph-panel.module';
import { TradeHistoryPanelModule } from './trade-history-panel/trade-history-panel.module';
import { OrderBookTradePanelModule } from './order-book-trade-panel/order-book-trade-panel.module';

import { DerivativesTradingComponent } from './derivatives-trading.component';

@NgModule({
  declarations: [DerivativesTradingComponent],
  imports: [
    CommonModule,
    DerivativesTradingRoutingModule,
    TradeAbleInstrumentsPanelModule,
    TradeGraphPanelModule,
    TradeHistoryPanelModule,
    OrderBookTradePanelModule,
  ],
  exports: [],
})
export class DerivativesTradingModule {}
