import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatPaginatorModule } from '@angular/material/paginator';

import { TableModule } from '../../../../ui-kit/table/table.module';
import { GraphKitModule } from '../../../../ui-kit/graph-kit/graph-kit.module';
import { SpinnerModule } from '../../../../ui-kit/spinner/spinner.module';

import { PortfolioSummaryPanelComponent } from './portfolio-summary-panel.component';
import { PortfolioSummaryTableComponent } from './portfolio-summary-table/portfolio-summary-table.component';
import { PortfolioSummaryGraphComponent } from './portfolio-summary-graph/portfolio-summary-graph.component';
import { ErrorHandlerModule } from '../../../../ui-kit/error-handler/error-handler.module';

@NgModule({
  declarations: [PortfolioSummaryPanelComponent, PortfolioSummaryTableComponent, PortfolioSummaryGraphComponent],
  imports: [CommonModule, MatPaginatorModule, TableModule, GraphKitModule, SpinnerModule, ErrorHandlerModule],
  exports: [PortfolioSummaryPanelComponent],
})
export class PortfolioSummaryPanelModule {}
