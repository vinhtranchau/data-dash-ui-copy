import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { GraphKitModule } from '../graph-kit/graph-kit.module';
import { PipeModule } from '../pipe/pipe.module';
import { SpinnerModule } from '../spinner/spinner.module';
import { IndexCardComponent } from './index-card.component';

@NgModule({
  declarations: [IndexCardComponent],
  imports: [CommonModule, GraphKitModule, PipeModule, RouterModule, SpinnerModule, MatIconModule],
  exports: [IndexCardComponent],
})
export class IndexCardModule {}
