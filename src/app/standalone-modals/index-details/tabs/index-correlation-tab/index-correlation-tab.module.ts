import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';

import { TableModule } from '../../../../ui-kit/table/table.module';

import { IndexCorrelationTabComponent } from './index-correlation-tab.component';
import {
  AdvancedIndexFilterDialogModule
} from '../../../../shared/advanced-index-filter-dialog/advanced-index-filter-dialog.module';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [IndexCorrelationTabComponent],
  imports: [CommonModule, MatIconModule, TableModule, MatBadgeModule, AdvancedIndexFilterDialogModule.forRoot(), MatTooltipModule],
  exports: [IndexCorrelationTabComponent],
})
export class IndexCorrelationTabModule {
}
