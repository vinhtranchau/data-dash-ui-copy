import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FormKitModule } from '../../../../ui-kit/form-kit/form-kit.module';
import { GraphKitModule } from '../../../../ui-kit/graph-kit/graph-kit.module';
import { SpinnerModule } from '../../../../ui-kit/spinner/spinner.module';
import { TableModule } from '../../../../ui-kit/table/table.module';

import { TrustedHomeComponent } from './trusted-home.component';

@NgModule({
  declarations: [TrustedHomeComponent],
  imports: [CommonModule, RouterModule, FormKitModule, GraphKitModule, TableModule, SpinnerModule],
  exports: [TrustedHomeComponent],
})
export class TrustedHomeModule {}
