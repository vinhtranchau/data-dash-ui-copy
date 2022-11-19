import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { ToastrModule } from 'ngx-toastr';

import { ToastService } from './toast.service';

import { ToastComponent } from './toast.component';

@NgModule({
  declarations: [ToastComponent],
  imports: [
    CommonModule,
    MatIconModule,
    ToastrModule.forRoot({
      toastComponent: ToastComponent,
    }),
  ],
})
export class ToastModule {
  static forRoot(): ModuleWithProviders<ToastModule> {
    return {
      ngModule: ToastModule,
      providers: [ToastService],
    };
  }
}
