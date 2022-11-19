import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MtxSliderModule } from '@ng-matero/extensions/slider';

import { ErrorHandlerModule } from '../../../../ui-kit/error-handler/error-handler.module';
import { SpinnerModule } from '../../../../ui-kit/spinner/spinner.module';
import { GraphKitModule } from '../../../../ui-kit/graph-kit/graph-kit.module';
import { FormKitModule } from '../../../../ui-kit/form-kit/form-kit.module';
import { TableModule } from '../../../../ui-kit/table/table.module';
import { PipeModule } from '../../../../ui-kit/pipe/pipe.module';
import { IndexDetailsHeaderModule } from '../../../../shared/index-details-header/index-details-header.module';
import { PortfolioTableModule } from '../../../../shared/portfolio-table/portfolio-table.module';

import { PurchaseDealComponent } from './purchase-deal.component';
import { AdditionalOptionsComponent } from './additional-options/additional-options.component';
import { IndividualContractConfigComponent } from './individual-contract/individual-contract-config/individual-contract-config.component';
import { ConfirmationDialogComponent } from './individual-contract/individual-contract-config/confirmation-dialog/confirmation-dialog.component';
import { RedirectDialogComponent } from './individual-contract/individual-contract-config/redirect-dialog/redirect-dialog.component';
import { QuoteDialogComponent } from './individual-contract/individual-contract-config/quote-dialog/quote-dialog.component';
import { CorrelatedIndexesTableComponent } from './correlated-indexes-table/correlated-indexes-table.component';
import { RollingDealContractConfigComponent } from './rolling-deal-contract/rolling-deal-contract-config/rolling-deal-contract-config.component';
import { IndividualContractComponent } from './individual-contract/individual-contract.component';
import { RollingDealContractComponent } from './rolling-deal-contract/rolling-deal-contract.component';
import { SwitchContractComponent } from './switch-contract/switch-contract.component';
import { PositionSummaryComponent } from './rolling-deal-contract/position-summary/position-summary.component';
import { RequestPricingDialogComponent } from './rolling-deal-contract/rolling-deal-contract-config/request-pricing-dialog/request-pricing-dialog.component';

@NgModule({
  declarations: [
    PurchaseDealComponent,
    AdditionalOptionsComponent,
    IndividualContractConfigComponent,
    ConfirmationDialogComponent,
    RedirectDialogComponent,
    QuoteDialogComponent,
    CorrelatedIndexesTableComponent,
    RollingDealContractConfigComponent,
    IndividualContractComponent,
    RollingDealContractComponent,
    SwitchContractComponent,
    PositionSummaryComponent,
    RequestPricingDialogComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatDialogModule,
    MatInputModule,
    MatProgressBarModule,
    FormKitModule,
    ErrorHandlerModule,
    IndexDetailsHeaderModule,
    SpinnerModule,
    GraphKitModule,
    PipeModule,
    PortfolioTableModule,
    MatTabsModule,
    TableModule,
    MtxSliderModule,
  ],
  exports: [PurchaseDealComponent],
})
export class PurchaseDealModule {}
