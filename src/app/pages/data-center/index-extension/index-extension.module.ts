import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableModule } from '../../../ui-kit/table/table.module';
import { DialogModule } from '../../../ui-kit/dialog/dialog.module';
import { FormKitModule } from '../../../ui-kit/form-kit/form-kit.module';
import { UploaderModule } from '../../../ui-kit/uploader/uploader.module';
import { IndexExtensionComponent } from './index-extension.component';

import { IndexExtensionRoutingModule } from './index-extension-routing.module';

import { IndexExtensionEditDialogComponent } from './index-extension-edit-dialog/index-extension-edit-dialog.component';

@NgModule({
  declarations: [IndexExtensionComponent, IndexExtensionEditDialogComponent],
  imports: [CommonModule, IndexExtensionRoutingModule, DialogModule, TableModule, FormKitModule, UploaderModule],
})
export class IndexExtensionModule {
}
