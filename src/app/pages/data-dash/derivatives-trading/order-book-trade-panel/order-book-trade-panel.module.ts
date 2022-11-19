import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

import { SpinnerModule } from '../../../../ui-kit/spinner/spinner.module';

import { OrderBookTradePanelComponent } from './order-book-trade-panel.component';
import { StatusBarComponent } from './status-bar/status-bar.component';
import { ErrorHandlerModule } from '../../../../ui-kit/error-handler/error-handler.module';
import { GraphKitModule } from '../../../../ui-kit/graph-kit/graph-kit.module';

@NgModule({
  declarations: [OrderBookTradePanelComponent, StatusBarComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    SpinnerModule,
    ErrorHandlerModule,
    GraphKitModule,
  ],
  exports: [OrderBookTradePanelComponent],
})
export class OrderBookTradePanelModule {}
