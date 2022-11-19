import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { QuantPortfolioComponent } from './quant-portfolio.component';

const routes: Routes = [{ path: '', component: QuantPortfolioComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuantPortfolioRoutingModule {}
