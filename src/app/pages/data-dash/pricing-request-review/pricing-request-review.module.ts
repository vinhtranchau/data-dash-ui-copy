import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

import { TableModule } from '../../../ui-kit/table/table.module';
import { FormKitModule } from '../../../ui-kit/form-kit/form-kit.module';
import { SpinnerModule } from '../../../ui-kit/spinner/spinner.module';

import { PricingRequestReviewRoutingModule } from './pricing-request-review-routing.module';
import { PricingRequestReviewComponent } from './pricing-request-review.component';

@NgModule({
  declarations: [PricingRequestReviewComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    PricingRequestReviewRoutingModule,
    TableModule,
    FormKitModule,
    SpinnerModule,
  ],
})
export class PricingRequestReviewModule {}
