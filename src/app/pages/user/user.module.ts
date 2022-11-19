import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { DashboardLayoutModule } from '../../layout/dashboard-layout/dashboard-layout.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, UserRoutingModule, DashboardLayoutModule],
})
export class UserModule {}
