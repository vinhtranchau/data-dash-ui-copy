import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TradingCenterComponent } from './trading-center.component';
import { PurchaseDealComponent } from './purchase-deal/purchase-deal.component';
import { ViewDealComponent } from './view-deal/view-deal.component';

const routes: Routes = [
  { path: '', component: TradingCenterComponent },
  { path: 'trade/:id/:type', component: PurchaseDealComponent },
  { path: 'view/:id', component: ViewDealComponent },
  { path: '**', component: TradingCenterComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TradingCenterRoutingModule {}
