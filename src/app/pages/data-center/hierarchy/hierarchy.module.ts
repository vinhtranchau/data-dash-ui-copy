import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';

import { TableModule } from '../../../ui-kit/table/table.module';
import { DialogModule } from '../../../ui-kit/dialog/dialog.module';
import { FormKitModule } from '../../../ui-kit/form-kit/form-kit.module';

import { HierarchyRoutingModule } from './hierarchy-routing.module';

import { HierarchyComponent } from './hierarchy.component';
import { HierarchyTableComponent } from './hierarchy-tables/hierarchy-tables.component';
import { HierarchyDialogComponent } from './hierarchy-edit-dialog/hierarchy-edit-dialog.component';

@NgModule({
  declarations: [HierarchyComponent, HierarchyTableComponent, HierarchyDialogComponent],
  imports: [CommonModule, MatTabsModule, HierarchyRoutingModule, DialogModule, TableModule, FormKitModule],
})
export class HierarchyModule {
}
