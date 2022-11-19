import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NationComponent } from './nation.component';

const routes: Routes = [
  {
    path: '',
    component: NationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NationRoutingModule {
}
