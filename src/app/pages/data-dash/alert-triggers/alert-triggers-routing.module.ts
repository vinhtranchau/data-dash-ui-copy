import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AlertTriggersComponent } from './alert-triggers.component';

const routes: Routes = [
  {
    path: '',
    component: AlertTriggersComponent,
  },
  {
    path: ':id',
    component: AlertTriggersComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AlertTriggersRoutingModule {}
