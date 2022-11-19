import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { IndexExtensionComponent } from './index-extension.component';

const routes: Routes = [
  {
    path: '',
    component: IndexExtensionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IndexExtensionRoutingModule {
}
