import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HistoricalDataComponent } from './historical-data.component';

const routes: Routes = [
  {
    path: '',
    component: HistoricalDataComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistoricalDataRoutingModule {
}
