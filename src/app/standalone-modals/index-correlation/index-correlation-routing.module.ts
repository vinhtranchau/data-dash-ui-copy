import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  IndexCorrelationDialogWrapperComponent
} from './index-correlation-dialog-wrapper/index-correlation-dialog-wrapper.component';

const routes: Routes = [
  {
    path: ':indexId1/:indexId2/:sizeType',
    component: IndexCorrelationDialogWrapperComponent,
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IndexCorrelationRoutingModule {
}
