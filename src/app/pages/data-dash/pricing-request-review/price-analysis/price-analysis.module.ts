import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { PriceAnalysisRoutingModule } from './price-analysis-routing.module';

import { FormKitModule } from '../../../../ui-kit/form-kit/form-kit.module';
import { SpinnerModule } from '../../../../ui-kit/spinner/spinner.module';
import { TableModule } from '../../../../ui-kit/table/table.module';
import { DialogModule } from '../../../../ui-kit/dialog/dialog.module';
import { GraphKitModule } from '../../../../ui-kit/graph-kit/graph-kit.module';
import { PipeModule } from '../../../../ui-kit/pipe/pipe.module';
import { IndexDetailsHeaderModule } from '../../../../shared/index-details-header/index-details-header.module';

import { PriceAnalysisComponent } from './price-analysis.component';
import { DealDetailFormComponent } from './deal-detail-form/deal-detail-form.component';

import { FixationDatesPipe } from './pipes/fixation-dates.pipe';
import { UwDisabledPipe } from './pipes/uw-disabled.pipe';
import { QuotePublishingCheckFormComponent } from './quote-publishing-check-form/quote-publishing-check-form.component';
import { QuoteAnalysisTableComponent } from './quote-analysis-table/quote-analysis-table.component';
import { UpdateRollingDealDialogComponent } from './update-rolling-deal-dialog/update-rolling-deal-dialog.component';
import { IndexPriceGraphComponent } from './index-price-graph/index-price-graph.component';
import { QuoteReviewFormComponent } from './quote-review-form/quote-review-form.component';
import { RepriceConfirmDialogComponent } from './reprice-confirm-dialog/reprice-confirm-dialog.component';
import { QuoteFilesFormComponent } from './quote-files-form/quote-files-form.component';

@NgModule({
  declarations: [
    PriceAnalysisComponent,
    DealDetailFormComponent,
    FixationDatesPipe,
    QuotePublishingCheckFormComponent,
    QuoteAnalysisTableComponent,
    UpdateRollingDealDialogComponent,
    IndexPriceGraphComponent,
    QuoteReviewFormComponent,
    RepriceConfirmDialogComponent,
    QuoteFilesFormComponent,
    UwDisabledPipe,
  ],
  imports: [
    CommonModule,
    PriceAnalysisRoutingModule,
    SpinnerModule,
    IndexDetailsHeaderModule,
    FormKitModule,
    TableModule,
    DialogModule,
    GraphKitModule,
    PipeModule,
  ],
  providers: [DatePipe],
})
export class PriceAnalysisModule {}
