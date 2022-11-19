import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormKitModule } from '../../ui-kit/form-kit/form-kit.module';
import { DialogModule } from '../../ui-kit/dialog/dialog.module';

import { AdvancedIndexFilterDialogService } from './advanced-index-filter-dialog.service';

import { FieldTypePipe } from './pipes/field-type.pipe';
import { SearchOptionsPipe } from './pipes/search-options.pipe';
import { EnumFieldOptionsPipe } from './pipes/enum-field-options.pipe';

import { AdvancedIndexFilterDialogComponent } from './advanced-index-filter-dialog.component';

@NgModule({
  declarations: [AdvancedIndexFilterDialogComponent, FieldTypePipe, SearchOptionsPipe, EnumFieldOptionsPipe],
  imports: [CommonModule, FormKitModule, DialogModule],
})
export class AdvancedIndexFilterDialogModule {
  static forRoot(): ModuleWithProviders<AdvancedIndexFilterDialogModule> {
    return {
      ngModule: AdvancedIndexFilterDialogModule,
      providers: [AdvancedIndexFilterDialogService],
    };
  }
}
