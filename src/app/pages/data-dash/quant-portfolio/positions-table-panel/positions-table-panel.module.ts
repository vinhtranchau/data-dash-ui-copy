import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';

import { TableModule } from '../../../../ui-kit/table/table.module';

import { PositionsTablePanelComponent } from './positions-table-panel.component';

@NgModule({
  declarations: [PositionsTablePanelComponent],
  imports: [CommonModule, MatPaginatorModule, TableModule],
  exports: [PositionsTablePanelComponent],
})
export class PositionsTablePanelModule {}
