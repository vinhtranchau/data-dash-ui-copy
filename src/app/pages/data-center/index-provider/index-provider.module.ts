import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableModule } from '../../../ui-kit/table/table.module';
import { DialogModule } from '../../../ui-kit/dialog/dialog.module';
import { FormKitModule } from '../../../ui-kit/form-kit/form-kit.module';

import { IndexProviderRoutingModule } from './index-provider-routing.module';

import { IndexProviderComponent } from './index-provider.component';
import { IndexProviderEditDialogComponent } from './index-provider-edit-dialog/index-provider-edit-dialog.component';

@NgModule({
  declarations: [IndexProviderComponent, IndexProviderEditDialogComponent],
  imports: [CommonModule, IndexProviderRoutingModule, DialogModule, TableModule, FormKitModule],
})
export class IndexProviderModule {
}
