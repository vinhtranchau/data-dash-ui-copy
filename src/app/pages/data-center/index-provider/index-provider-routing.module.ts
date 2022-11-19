import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { IndexProviderComponent } from './index-provider.component';

const routes: Routes = [
  {
    path: '',
    component: IndexProviderComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IndexProviderRoutingModule {
}
