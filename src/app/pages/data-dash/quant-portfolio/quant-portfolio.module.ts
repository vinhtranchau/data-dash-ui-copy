import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { QuantPortfolioRoutingModule } from './quant-portfolio-routing.module';

import { PortfolioSummaryPanelModule } from './portfolio-summary-panel/portfolio-summary-panel.module';
import { PositionsTablePanelModule } from './positions-table-panel/positions-table-panel.module';

import { QuantPortfolioComponent } from './quant-portfolio.component';
import { ActionGroupPanelComponent } from './action-group-panel/action-group-panel.component';
import { PipeModule } from '../../../ui-kit/pipe/pipe.module';

@NgModule({
  declarations: [QuantPortfolioComponent, ActionGroupPanelComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    QuantPortfolioRoutingModule,
    PortfolioSummaryPanelModule,
    PositionsTablePanelModule,
    PipeModule,
  ],
})
export class QuantPortfolioModule {}
