import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatDialogModule } from '@angular/material/dialog';

import { IndexCorrelationDialogComponent } from './index-correlation-dialog/index-correlation-dialog.component';
import {
  IndexCorrelationDialogWrapperComponent
} from './index-correlation-dialog-wrapper/index-correlation-dialog-wrapper.component';

import { IndexCorrelationRoutingModule } from './index-correlation-routing.module';
import { SpinnerModule } from 'src/app/ui-kit/spinner/spinner.module';
import { GraphKitModule } from 'src/app/ui-kit/graph-kit/graph-kit.module';
import { ErrorHandlerModule } from '../../ui-kit/error-handler/error-handler.module';
import {
  DetailsSidebarModule
} from '../index-details/tabs/general-information-tab/details-sidebar/details-sidebar.module';
import { FormKitModule } from '../../ui-kit/form-kit/form-kit.module';
import { ScrollableContentModule } from '../../ui-kit/scrollable-content/scrollable-content.module';
import { MatTabsModule } from '@angular/material/tabs';
import { GeneralInformationComponent } from './tabs/general-information/general-information.component';
import { SecondaryChartsComponent } from './tabs/secondary-charts/secondary-charts.component';
import { BasisPlotsComponent } from './tabs/basis-plots/basis-plots.component';
import { IndexCorrelationStoreService } from './index-correlation-store.service';
import { HeaderMobileModule } from '../header-mobile/header-mobile.module';

@NgModule({
  declarations: [
    IndexCorrelationDialogComponent,
    IndexCorrelationDialogWrapperComponent,
    GeneralInformationComponent,
    SecondaryChartsComponent,
    BasisPlotsComponent,
  ],
  imports: [
    CommonModule,
    IndexCorrelationRoutingModule,
    MatDialogModule,
    SpinnerModule,
    GraphKitModule,
    ErrorHandlerModule,
    DetailsSidebarModule,
    FormKitModule,
    ScrollableContentModule,
    MatTabsModule,
    HeaderMobileModule
  ],
  providers: [IndexCorrelationStoreService],
})
export class IndexCorrelationModule {
}
