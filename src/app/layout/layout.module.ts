import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AuthLayoutModule } from './auth-layout/auth-layout.module';
import { DashboardLayoutModule } from './dashboard-layout/dashboard-layout.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule, AuthLayoutModule, DashboardLayoutModule],
  exports: [DashboardLayoutModule, AuthLayoutModule],
})
export class LayoutModule {}
