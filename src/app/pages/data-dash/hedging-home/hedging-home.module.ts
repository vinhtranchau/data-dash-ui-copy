import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HedgingHomeRoutingModule } from './hedging-home-routing.module';

import { GenerateStrategyPageModule } from './generate-strategy-page/generate-strategy-page.module';
import { ViewStrategyPageModule } from './view-strategy-page/view-strategy-page.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, HedgingHomeRoutingModule, GenerateStrategyPageModule, ViewStrategyPageModule],
  providers: [],
})
export class HedgingHomeModule {}
