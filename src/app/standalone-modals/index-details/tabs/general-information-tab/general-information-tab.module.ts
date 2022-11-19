import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ErrorHandlerModule } from '../../../../ui-kit/error-handler/error-handler.module';
import { GraphKitModule } from '../../../../ui-kit/graph-kit/graph-kit.module';
import { FormKitModule } from '../../../../ui-kit/form-kit/form-kit.module';
import { PipeModule } from '../../../../ui-kit/pipe/pipe.module';
import { SpinnerModule } from '../../../../ui-kit/spinner/spinner.module';

import { GeneralInformationTabComponent } from './general-information-tab.component';
import { StatisticsSidebarComponent } from './statistics-sidebar/statistics-sidebar.component';
import { AdditionalOptionsFormComponent } from './additional-options-form/additional-options-form.component';
import { DetailsSidebarModule } from './details-sidebar/details-sidebar.module';
import { PriceChangeHeaderComponent } from './price-change-header/price-change-header.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    GeneralInformationTabComponent,
    StatisticsSidebarComponent,
    AdditionalOptionsFormComponent,
    PriceChangeHeaderComponent,
  ],
  imports: [
    CommonModule,
    ErrorHandlerModule,
    GraphKitModule,
    FormKitModule,
    PipeModule,
    SpinnerModule,
    DetailsSidebarModule,
    MatTooltipModule,
  ],
  exports: [GeneralInformationTabComponent],
})
export class GeneralInformationTabModule {}
