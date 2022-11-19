import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PriceAnalysisComponent } from './price-analysis.component';

const routes: Routes = [
  {
    path: '',
    component: PriceAnalysisComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PriceAnalysisRoutingModule {}
