import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GenerateStrategyPageComponent } from './generate-strategy-page/generate-strategy-page.component';
import { ViewStrategyPageComponent } from './view-strategy-page/view-strategy-page.component';

const routes: Routes = [
  { path: '', component: GenerateStrategyPageComponent },
  { path: ':id', component: ViewStrategyPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HedgingHomeRoutingModule {}
