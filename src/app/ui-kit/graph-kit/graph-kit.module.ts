import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import * as PlotlyJS from 'plotly.js-dist-min';
import { PlotlyModule } from 'angular-plotly.js';

import { SpinnerModule } from '../spinner/spinner.module';

import { BasicChartComponent } from './basic-chart/basic-chart.component';

PlotlyModule.plotlyjs = PlotlyJS;

@NgModule({
  declarations: [BasicChartComponent],
  imports: [CommonModule, PlotlyModule, SpinnerModule, MatIconModule, MatButtonModule],
  exports: [BasicChartComponent],
})
export class GraphKitModule {}
