import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SwiperModule } from 'swiper/angular';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { IndexCardV2Module } from '../../../ui-kit/index-card-v2/index-card-v2.module';
import { FormKitModule } from '../../../ui-kit/form-kit/form-kit.module';
import { SpinnerModule } from '../../../ui-kit/spinner/spinner.module';
import { PaginatorButtonsModule } from '../../../ui-kit/paginator-buttons/paginator-buttons.module';

import { PurchaseDealModule } from './purchase-deal/purchase-deal.module';

import { TradingCenterRoutingModule } from './trading-center-routing.module';

import { TradingCenterComponent } from './trading-center.component';
import { ProductRowComponent } from './product-row/product-row.component';
import { ViewDealComponent } from './view-deal/view-deal.component';
import { DealConfigComponent } from './view-deal/deal-config/deal-config.component';
import { CancelTradeComponent } from './view-deal/cancel-trade/cancel-trade.component';
import { ErrorHandlerModule } from '../../../ui-kit/error-handler/error-handler.module';
import { GraphKitModule } from '../../../ui-kit/graph-kit/graph-kit.module';
import { PipeModule } from '../../../ui-kit/pipe/pipe.module';
import { IndexDetailsHeaderModule } from '../../../shared/index-details-header/index-details-header.module';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  declarations: [
    TradingCenterComponent,
    ProductRowComponent,
    ViewDealComponent,
    DealConfigComponent,
    CancelTradeComponent,
  ],
  imports: [
    CommonModule,
    SwiperModule,
    InfiniteScrollModule,
    FormKitModule,
    MatMenuModule,
    SpinnerModule,
    PaginatorButtonsModule,
    IndexCardV2Module,
    PurchaseDealModule,
    TradingCenterRoutingModule,
    ErrorHandlerModule,
    IndexDetailsHeaderModule,
    GraphKitModule,
    PipeModule,
  ],
})
export class TradingCenterModule {}
