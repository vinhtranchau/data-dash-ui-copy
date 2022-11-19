import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RollingDealActionComponent } from './rolling-deal-action.component';

const routes: Routes = [
  {
    path: ':id/:sizeType',
    component: RollingDealActionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RollingDealActionRoutingModule {}
