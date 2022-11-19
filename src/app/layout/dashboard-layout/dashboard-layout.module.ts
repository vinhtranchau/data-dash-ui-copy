import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';

import { NavbarModule } from './navbar/navbar.module';

import { DashboardLayoutComponent } from './dashboard-layout.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SidebarMobileComponent } from './sidebar-mobile/sidebar-mobile.component';
import { PipeModule } from '../../ui-kit/pipe/pipe.module';

@NgModule({
  declarations: [DashboardLayoutComponent, SidebarComponent, SidebarMobileComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatMenuModule,
    NavbarModule,
    PipeModule,
  ],
  exports: [DashboardLayoutComponent],
})
export class DashboardLayoutModule {}
