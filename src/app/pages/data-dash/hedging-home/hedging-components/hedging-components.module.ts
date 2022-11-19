import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SpinnerModule } from '../../../../ui-kit/spinner/spinner.module';
import { ErrorHandlerModule } from '../../../../ui-kit/error-handler/error-handler.module';
import { PipeModule } from '../../../../ui-kit/pipe/pipe.module';

import { IndexDetailsComponent } from './index-details/index-details.component';

@NgModule({
  declarations: [IndexDetailsComponent],
  imports: [CommonModule, SpinnerModule, ErrorHandlerModule, PipeModule],
  exports: [IndexDetailsComponent],
})
export class HedgingComponentsModule {}
