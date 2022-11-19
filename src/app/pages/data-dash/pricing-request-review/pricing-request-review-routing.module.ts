import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PricingRequestReviewComponent } from './pricing-request-review.component';

const routes: Routes = [
  {
    path: '',
    component: PricingRequestReviewComponent,
  },
  {
    path: ':id',
    loadChildren: () => import('./price-analysis/price-analysis.module').then((m) => m.PriceAnalysisModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PricingRequestReviewRoutingModule {}
