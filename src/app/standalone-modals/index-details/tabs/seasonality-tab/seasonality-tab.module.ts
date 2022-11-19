import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ErrorHandlerModule } from '../../../../ui-kit/error-handler/error-handler.module';
import { SpinnerModule } from '../../../../ui-kit/spinner/spinner.module';
import { FormKitModule } from '../../../../ui-kit/form-kit/form-kit.module';
import { GraphKitModule } from '../../../../ui-kit/graph-kit/graph-kit.module';
import { StatsTableModule } from './stats-table/stats-table.module';
import { ScrollableContentModule } from '../../../../ui-kit/scrollable-content/scrollable-content.module';

import { SeasonalityTabComponent } from './seasonality-tab.component';


@NgModule({
  declarations: [SeasonalityTabComponent],
  imports: [
    CommonModule,
    ErrorHandlerModule,
    SpinnerModule,
    FormKitModule,
    GraphKitModule,
    StatsTableModule,
    ScrollableContentModule,
  ],
  exports: [SeasonalityTabComponent],
})
export class SeasonalityTabModule {
}
