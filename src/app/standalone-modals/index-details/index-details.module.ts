import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { PipeModule } from '../../ui-kit/pipe/pipe.module';
import { SpinnerModule } from '../../ui-kit/spinner/spinner.module';

import { IndexDetailsRoutingModule } from './index-details-routing.module';

import { SeasonalityTabModule } from './tabs/seasonality-tab/seasonality-tab.module';
import { GeneralInformationTabModule } from './tabs/general-information-tab/general-information-tab.module';
import { EmpiricalModellingTabModule } from './tabs/empirical-modelling-tab/empirical-modelling-tab.module';
import { IndexCorrelationTabModule } from './tabs/index-correlation-tab/index-correlation-tab.module';

import { IndexDetailsStoreService } from './index-details-store.service';

import {
  IndexDetailsDialogWrapperComponent
} from './index-details-dialog-wrapper/index-details-dialog-wrapper.component';
import { IndexDetailsDialogComponent } from './index-details-dialog/index-details-dialog.component';
import { HeaderMobileModule } from '../header-mobile/header-mobile.module';

@NgModule({
  declarations: [IndexDetailsDialogComponent, IndexDetailsDialogWrapperComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatTabsModule,
    MatTooltipModule,
    IndexDetailsRoutingModule,
    SpinnerModule,
    PipeModule,
    // Tab modules
    GeneralInformationTabModule,
    SeasonalityTabModule,
    EmpiricalModellingTabModule,
    IndexCorrelationTabModule,
    MatIconModule,
    HeaderMobileModule
  ],
  providers: [IndexDetailsStoreService],
})
export class IndexDetailsModule {
}
