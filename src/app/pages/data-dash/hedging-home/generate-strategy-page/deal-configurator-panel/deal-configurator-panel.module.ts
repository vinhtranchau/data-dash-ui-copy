import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';

import { FormKitModule } from '../../../../../ui-kit/form-kit/form-kit.module';
import { SpinnerModule } from '../../../../../ui-kit/spinner/spinner.module';
import { ErrorHandlerModule } from '../../../../../ui-kit/error-handler/error-handler.module';

import { HedgingComponentsModule } from '../../hedging-components/hedging-components.module';

import { DealConfiguratorPanelComponent } from './deal-configurator-panel.component';

import { IndexSelectTabComponent } from './index-select-tab/index-select-tab.component';
import { PositionSelectTabComponent } from './position-select-tab/position-select-tab.component';
import { DealDetailsConfiguratorComponent } from './deal-details-configurator/deal-details-configurator.component';

@NgModule({
  declarations: [
    DealConfiguratorPanelComponent,
    DealDetailsConfiguratorComponent,
    IndexSelectTabComponent,
    PositionSelectTabComponent,
  ],
  imports: [CommonModule, MatTabsModule, FormKitModule, SpinnerModule, ErrorHandlerModule, HedgingComponentsModule],
  exports: [DealConfiguratorPanelComponent],
})
export class DealConfiguratorPanelModule {}
