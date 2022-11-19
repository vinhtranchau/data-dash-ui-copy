import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { PipeModule } from '../../../ui-kit/pipe/pipe.module';

import { NavbarComponent } from './navbar.component';
import { ProfileMenuComponent } from './profile-menu/profile-menu.component';
import { PlatformToggleComponent } from './platform-toggle/platform-toggle.component';
import { NotificationMenuComponent } from './notification-menu/notification-menu.component';
import { NotificationMenuItemComponent } from './notification-menu/notification-menu-item/notification-menu-item.component';

@NgModule({
  declarations: [
    NavbarComponent,
    ProfileMenuComponent,
    PlatformToggleComponent,
    NotificationMenuComponent,
    NotificationMenuItemComponent,
  ],
  imports: [
    CommonModule,
    MatButtonToggleModule,
    PipeModule,
    MatIconModule,
    RouterModule,
    MatButtonModule,
    MatMenuModule,
    MatDialogModule,
  ],
  exports: [NavbarComponent],
})
export class NavbarModule {}
