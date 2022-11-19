import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  IndexDetailsDialogWrapperComponent
} from './index-details-dialog-wrapper/index-details-dialog-wrapper.component';

const routes: Routes = [
  {
    path: ':id/:tab/:sizeType',
    component: IndexDetailsDialogWrapperComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IndexDetailsRoutingModule {
}
