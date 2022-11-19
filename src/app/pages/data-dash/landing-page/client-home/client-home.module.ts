import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientHomeComponent } from './client-home.component';
import { RouterModule } from '@angular/router';
import { TableModule } from '../../../../ui-kit/table/table.module';
import { FavoriteIndexesComponent } from './favorite-indexes/favorite-indexes.component';
import { PipeModule } from '../../../../ui-kit/pipe/pipe.module';
import { SpinnerModule } from '../../../../ui-kit/spinner/spinner.module';
import { GraphKitModule } from '../../../../ui-kit/graph-kit/graph-kit.module';
import { FormKitModule } from '../../../../ui-kit/form-kit/form-kit.module';
import { MatTabsModule } from '@angular/material/tabs';
import { PortfolioSummaryComponent } from './portfolio-summary/portfolio-summary.component';
import { PortfolioTableModule } from '../../../../shared/portfolio-table/portfolio-table.module';
import { IndexCardModule } from '../../../../ui-kit/index-card/index-card.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  declarations: [ClientHomeComponent, FavoriteIndexesComponent, PortfolioSummaryComponent],
  imports: [
    CommonModule,
    RouterModule,
    TableModule,
    PipeModule,
    SpinnerModule,
    GraphKitModule,
    FormKitModule,
    MatTabsModule,
    IndexCardModule,
    PortfolioTableModule,
    InfiniteScrollModule,
  ],
  exports: [ClientHomeComponent],
})
export class ClientHomeModule {}
