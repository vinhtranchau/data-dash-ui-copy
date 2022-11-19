import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MtxAlertModule } from '@ng-matero/extensions/alert';

import { FormKitModule } from '../../ui-kit/form-kit/form-kit.module';

import { DataCenterRoutingModule } from './data-center-routing.module';
import { DashboardLayoutModule } from '../../layout/dashboard-layout/dashboard-layout.module';

import { DataCenterComponent } from './data-center.component';

@NgModule({
  declarations: [DataCenterComponent],
  imports: [CommonModule, MtxAlertModule, DashboardLayoutModule, DataCenterRoutingModule, FormKitModule],
})
export class DataCenterModule {}
