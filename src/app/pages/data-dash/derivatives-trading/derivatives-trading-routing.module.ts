import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DerivativesTradingComponent } from './derivatives-trading.component';

const routes: Routes = [
  {
    path: '',
    component: DerivativesTradingComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DerivativesTradingRoutingModule {}
