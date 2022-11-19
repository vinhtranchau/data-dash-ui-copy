import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { PipeModule } from '../../../../../ui-kit/pipe/pipe.module';

import { BackgroundColorPipe } from './background-color.pipe';
import { FontColorPipe } from './font-color.pipe';

import { StatsTableComponent } from './stats-table.component';

@NgModule({
  declarations: [StatsTableComponent, BackgroundColorPipe, FontColorPipe],
  imports: [
    CommonModule,
    MatTableModule,
    MatTooltipModule,
    PipeModule,
  ],
  exports: [StatsTableComponent],
})
export class StatsTableModule {
}
