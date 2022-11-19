import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';

import { SpinnerModule } from '../../../../ui-kit/spinner/spinner.module';
import { FormKitModule } from '../../../../ui-kit/form-kit/form-kit.module';
import { GraphKitModule } from '../../../../ui-kit/graph-kit/graph-kit.module';
import { TableModule } from '../../../../ui-kit/table/table.module';
import { ErrorHandlerModule } from '../../../../ui-kit/error-handler/error-handler.module';

import { EmpiricalModellingTabComponent } from './empirical-modelling-tab.component';
import { ContractsDurationComponent } from './contracts-duration/contracts-duration.component';
import { ConfigureContractsFormComponent } from './configure-contracts-form/configure-contracts-form.component';
import { HistoricalPayoffComponent } from './historical-payoff/historical-payoff.component';
import { NetPositionComponent } from './net-position/net-position.component';
import { EmpiricalStatsComponent } from './empirical-stats/empirical-stats.component';
import { SimulationStatsComponent } from './simulation-stats/simulation-stats.component';

@NgModule({
  declarations: [EmpiricalModellingTabComponent, ContractsDurationComponent, ConfigureContractsFormComponent, HistoricalPayoffComponent, NetPositionComponent, EmpiricalStatsComponent, SimulationStatsComponent],
  imports: [CommonModule, SpinnerModule, FormKitModule, GraphKitModule, TableModule, MatTabsModule, ErrorHandlerModule],
  exports: [EmpiricalModellingTabComponent],
})
export class EmpiricalModellingTabModule {
}
