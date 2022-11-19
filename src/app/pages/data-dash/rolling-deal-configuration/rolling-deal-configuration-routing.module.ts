import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RollingDealConfigurationComponent } from './rolling-deal-configuration.component';

const routes: Routes = [{ path: '', component: RollingDealConfigurationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RollingDealConfigurationRoutingModule {}
