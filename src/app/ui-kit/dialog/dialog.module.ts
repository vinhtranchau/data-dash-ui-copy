import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { SpinnerModule } from '../spinner/spinner.module';

import { DialogService } from './dialog.service';

import { DialogLayoutComponent } from './dialog-layout/dialog-layout.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';

@NgModule({
  declarations: [DialogLayoutComponent, ConfirmDialogComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    DragDropModule,
    SpinnerModule,
  ],
  exports: [DialogLayoutComponent, MatDialogModule, ConfirmDialogComponent],
})
export class DialogModule {
  static forRoot(): ModuleWithProviders<DialogModule> {
    return {
      ngModule: DialogModule,
      providers: [DialogService],
    };
  }
}
