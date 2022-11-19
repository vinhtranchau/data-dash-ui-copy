import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { OverlayModule } from '@angular/cdk/overlay';

import { GraphKitModule } from '../graph-kit/graph-kit.module';
import { PipeModule } from '../pipe/pipe.module';
import { SpinnerModule } from '../spinner/spinner.module';

import { IndexCardV2Component } from './index-card-v2.component';
import { IconModule } from '../icon/icon.module';

@NgModule({
  declarations: [IndexCardV2Component],
  imports: [
    CommonModule,
    MatIconModule,
    OverlayModule,
    GraphKitModule,
    PipeModule,
    RouterModule,
    SpinnerModule,
    IconModule,
  ],
  exports: [IndexCardV2Component],
})
export class IndexCardV2Module {}
