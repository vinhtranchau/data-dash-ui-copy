import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { TableModule } from '../../ui-kit/table/table.module';
import { PipeModule } from '../../ui-kit/pipe/pipe.module';

import { FilteredTableComponent } from './filtered-table/filtered-table.component';
import { RollingDealsComponent } from './rolling-deals/rolling-deals.component';
import { PortfolioTableComponent } from './portfolio-table.component';
import { IsViewQuotePipe } from './pipes/is-view-quote.pipe';

@NgModule({
  declarations: [PortfolioTableComponent, FilteredTableComponent, RollingDealsComponent, IsViewQuotePipe],
  imports: [
    CommonModule,
    TableModule,
    MatTabsModule,
    MatIconModule,
    RouterLink,
    RouterModule,
    MatButtonModule,
    PipeModule,
  ],
  exports: [PortfolioTableComponent],
})
export class PortfolioTableModule {}
