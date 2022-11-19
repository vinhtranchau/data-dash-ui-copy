import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TextTransformPipe } from '../../../ui-kit/pipe/text-transform.pipe';

import { PipeModule } from '../../../ui-kit/pipe/pipe.module';
import { TableModule } from '../../../ui-kit/table/table.module';
import { DialogModule } from '../../../ui-kit/dialog/dialog.module';
import { FormKitModule } from '../../../ui-kit/form-kit/form-kit.module';
import { SpinnerModule } from '../../../ui-kit/spinner/spinner.module';
import {
  AdvancedIndexFilterDialogModule
} from '../../../shared/advanced-index-filter-dialog/advanced-index-filter-dialog.module';

import { IndexesRoutingModule } from './indexes-routing.module';

import { IndexesComponent } from './indexes.component';
import { IndexEditDialogComponent } from './index-edit-dialog/index-edit-dialog.component';
import {
  IndexSpecificationFormComponent
} from './index-edit-dialog/index-specification-form/index-specification-form.component';
import { IndexProviderFormComponent } from './index-edit-dialog/index-provider-form/index-provider-form.component';
import { IndexDataFormComponent } from './index-edit-dialog/index-data-form/index-data-form.component';
import { IndexGradingFormComponent } from './index-edit-dialog/index-grading-form/index-grading-form.component';

@NgModule({
  declarations: [
    IndexesComponent,
    IndexEditDialogComponent,
    IndexSpecificationFormComponent,
    IndexProviderFormComponent,
    IndexDataFormComponent,
    IndexGradingFormComponent,
  ],
  imports: [
    CommonModule,
    PipeModule,
    IndexesRoutingModule,
    TableModule,
    DialogModule,
    FormKitModule,
    SpinnerModule,
    AdvancedIndexFilterDialogModule.forRoot(),
  ],
  providers: [TextTransformPipe],
})
export class IndexesModule {
}
