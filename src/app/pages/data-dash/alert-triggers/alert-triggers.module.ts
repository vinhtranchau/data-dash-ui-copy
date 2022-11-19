import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';

import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { SpinnerModule } from '../../../ui-kit/spinner/spinner.module';
import { PipeModule } from '../../../ui-kit/pipe/pipe.module';

import { AlertTriggersRoutingModule } from './alert-triggers-routing.module';

import { AlertTypePipe } from './pipes/alert-type.pipe';
import { AlertTriggersComponent } from './alert-triggers.component';
import { AlertDetailComponent } from './alert-detail/alert-detail.component';
import { HistoricPriceCorrectionDetailsComponent } from './alert-detail/historic-price-correction-details/historic-price-correction-details.component';
import { AbnormalPriceMovementDetailsComponent } from './alert-detail/abnormal-price-movement-details/abnormal-price-movement-details.component';
import { MissingPriceUpdateDetailsComponent } from './alert-detail/missing-price-update-details/missing-price-update-details.component';
import { IndexDetailsChangedDetailsComponent } from './alert-detail/index-details-changed-details/index-details-changed-details.component';
import { NewIndexOnboardedDetailsComponent } from './alert-detail/new-index-onboarded-details/new-index-onboarded-details.component';
import { ScrapeMatchingChangedDetailsComponent } from './alert-detail/scrape-matching-changed-details/scrape-matching-changed-details.component';
import { ScrapeMatchingDeletedDetailsComponent } from './alert-detail/scrape-matching-deleted-details/scrape-matching-deleted-details.component';
import { FormKitModule } from '../../../ui-kit/form-kit/form-kit.module';

@NgModule({
  declarations: [
    AlertTriggersComponent,
    AlertDetailComponent,
    AlertTypePipe,
    HistoricPriceCorrectionDetailsComponent,
    AbnormalPriceMovementDetailsComponent,
    MissingPriceUpdateDetailsComponent,
    IndexDetailsChangedDetailsComponent,
    NewIndexOnboardedDetailsComponent,
    ScrapeMatchingChangedDetailsComponent,
    ScrapeMatchingDeletedDetailsComponent,
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatListModule,
    MatIconModule,
    InfiniteScrollModule,
    AlertTriggersRoutingModule,
    MatFormFieldModule,
    MatSelectModule,
    SpinnerModule,
    PipeModule,
    FormKitModule
  ],
})
export class AlertTriggersModule {}
