import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { PipeModule } from '../../ui-kit/pipe/pipe.module';

import { IndexDetailsHeaderComponent } from './index-details-header.component';

@NgModule({
  declarations: [IndexDetailsHeaderComponent],
  imports: [CommonModule, MatIconModule, PipeModule],
  exports: [IndexDetailsHeaderComponent],
})
export class IndexDetailsHeaderModule {}
