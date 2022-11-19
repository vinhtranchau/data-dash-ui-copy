import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DataDashRoutingModule } from './data-dash-routing.module';
import { DashboardLayoutModule } from '../../layout/dashboard-layout/dashboard-layout.module';
import { LandingPageModule } from './landing-page/landing-page.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DashboardLayoutModule,
    DataDashRoutingModule,
    LandingPageModule
  ]
})
export class DataDashModule {}
