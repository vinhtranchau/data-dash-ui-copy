import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ErrorHandlerModule } from '../../../../../ui-kit/error-handler/error-handler.module';
import { PipeModule } from '../../../../../ui-kit/pipe/pipe.module';
import { SpinnerModule } from '../../../../../ui-kit/spinner/spinner.module';
import { DetailsSidebarComponent } from './details-sidebar.component';
import { FormKitModule } from '../../../../../ui-kit/form-kit/form-kit.module';

@NgModule({
  declarations: [DetailsSidebarComponent],
  imports: [
    CommonModule,
    ErrorHandlerModule,
    PipeModule,
    SpinnerModule,
    FormKitModule,
  ],
  exports: [DetailsSidebarComponent],
})
export class DetailsSidebarModule {
}
