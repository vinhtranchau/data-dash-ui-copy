import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApiKeyRoutingModule } from './api-key-routing.module';
import { DialogModule } from '../../../ui-kit/dialog/dialog.module';
import { TableModule } from '../../../ui-kit/table/table.module';
import { FormKitModule } from '../../../ui-kit/form-kit/form-kit.module';
import { ApiKeyComponent } from './api-key.component';
import { ApiKeyEditDialogComponent } from './api-key-edit-dialog/api-key-edit-dialog.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [ApiKeyComponent, ApiKeyEditDialogComponent],
  imports: [CommonModule, ApiKeyRoutingModule, DialogModule, TableModule, FormKitModule, DragDropModule, MatTooltipModule],
})
export class ApiKeyModule {}
