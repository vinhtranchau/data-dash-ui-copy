import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatPaginatorModule } from '@angular/material/paginator';

import { FormKitModule } from '../../../ui-kit/form-kit/form-kit.module';
import { SpinnerModule } from '../../../ui-kit/spinner/spinner.module';
import { DialogModule } from '../../../ui-kit/dialog/dialog.module';
import { UiKitModule } from '../../../ui-kit/ui-kit.module';
import { PipeModule } from '../../../ui-kit/pipe/pipe.module';
import { GraphKitModule } from '../../../ui-kit/graph-kit/graph-kit.module';
import { AdvancedIndexFilterDialogModule } from '../../../shared/advanced-index-filter-dialog/advanced-index-filter-dialog.module';

import { DDIndexesRoutingModule } from './indexes-routing.module';

import { DDIndexesComponent } from './indexes.component';
import { DDIndexSearchComponent } from './index-search/index-search.component';
import { DDSearchBarComponent } from './search-bar/search-bar.component';
import { DDIndexSummary } from './index-search/index-summary/index-summary.component';
import { TableModule } from '../../../ui-kit/table/table.module';
import { HierarchyCountChartComponent } from './hierarchy-count-chart/hierarchy-count-chart.component';
import { PopularIndexesGraphComponent } from './popular-indexes-graph/popular-indexes-graph.component';
import { FavoriteIndexesTableComponent } from './favorite-indexes-table/favorite-indexes-table.component';
import { ErrorHandlerModule } from '../../../ui-kit/error-handler/error-handler.module';

@NgModule({
  declarations: [
    DDIndexesComponent,
    DDIndexSearchComponent,
    DDSearchBarComponent,
    DDIndexSummary,
    HierarchyCountChartComponent,
    PopularIndexesGraphComponent,
    FavoriteIndexesTableComponent,
  ],
  imports: [
    CommonModule,
    MatPaginatorModule,
    ScrollingModule,
    DDIndexesRoutingModule,
    SpinnerModule,
    FormKitModule,
    DialogModule,
    UiKitModule,
    PipeModule,
    GraphKitModule,
    TableModule,
    AdvancedIndexFilterDialogModule.forRoot(),
    ErrorHandlerModule,
  ],
})
export class DDIndexesModule {}
