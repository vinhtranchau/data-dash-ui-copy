import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

import { ErrorHandlerModule } from '../../../../ui-kit/error-handler/error-handler.module';
import { SpinnerModule } from '../../../../ui-kit/spinner/spinner.module';
import { TableModule } from '../../../../ui-kit/table/table.module';
import { PipeModule } from '../../../../ui-kit/pipe/pipe.module';
import { GraphKitModule } from '../../../../ui-kit/graph-kit/graph-kit.module';

import { HedgingComponentsModule } from '../hedging-components/hedging-components.module';

import { ViewStrategyPageComponent } from './view-strategy-page.component';

import { DealConfigComponent } from './deal-config/deal-config.component';
import { HedgeConfigComponent } from './hedge-config/hedge-config.component';
import { PlotStrategyComponent } from './plot-strategy/plot-strategy.component';
import { StrategyDetailComponent } from './strategy-detail/strategy-detail.component';
import { HedgingStrategiesTableComponent } from './hedging-strategies-table/hedging-strategies-table.component';

@NgModule({
  declarations: [
    ViewStrategyPageComponent,
    DealConfigComponent,
    HedgeConfigComponent,
    PlotStrategyComponent,
    StrategyDetailComponent,
    HedgingStrategiesTableComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    ErrorHandlerModule,
    SpinnerModule,
    PipeModule,
    TableModule,
    HedgingComponentsModule,
    GraphKitModule,
  ],
  exports: [ViewStrategyPageComponent],
})
export class ViewStrategyPageModule {}
