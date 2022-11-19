import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';

import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NotificationRoutingModule } from './notification-routing.module';

import { PipeModule } from '../../../ui-kit/pipe/pipe.module';
import { SpinnerModule } from '../../../ui-kit/spinner/spinner.module';

import { NotificationComponent } from './notification.component';
import { NotificationComponentComponent } from './notification-component/notification-component.component';

@NgModule({
  declarations: [NotificationComponent, NotificationComponentComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule,
    MatListModule,
    InfiniteScrollModule,
    MatButtonModule,
    MatButtonToggleModule,
    NotificationRoutingModule,
    PipeModule,
    SpinnerModule,
  ],
})
export class NotificationModule {}
