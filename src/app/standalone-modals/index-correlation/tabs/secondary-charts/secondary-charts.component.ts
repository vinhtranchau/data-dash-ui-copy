import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, filter, firstValueFrom, Subject, takeUntil } from 'rxjs';
import { monthsOrder } from '../../../../core/models/dates.model';
import { linearRegression } from '../../../../core/utils/linear-regression.util';
import { getDecimal } from '../../../../core/utils/number.util';
import { PlotlyData } from '../../../../ui-kit/graph-kit/plotly-chart.models';
import {
  PlotlyAxisTypes,
  PlotlyGraphTypes,
  PlotlyLineDashTypes,
  PlotlyModeTypes,
  PlotlyTraceColors
} from '../../../../ui-kit/graph-kit/plotly-chart.options';
import { IndexCorrelationStoreService } from '../../index-correlation-store.service';

@Component({
  selector: 'dd-secondary-charts',
  templateUrl: './secondary-charts.component.html',
  styleUrls: ['./secondary-charts.component.scss'],
})
export class SecondaryChartsComponent implements OnInit, OnDestroy {
  @Input() fullscreen: boolean;
  @Input() isMonthly$: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  scatterPlot: PlotlyData[] = [];
  scatterPlotLayout: any;
  refreshScatterPlotLayout$ = new Subject<any>();
  seasonalityPlot: PlotlyData[];
  seasonalityPlotLayout: any;
  refreshSeasonalityPlotLayout$ = new Subject<any>();
  private unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(public indexCorrelationStoreService: IndexCorrelationStoreService) {
  }

  async ngOnInit() {
    await firstValueFrom(this.indexCorrelationStoreService.spinner.isLoading$.pipe(filter((isLoading) => !isLoading)));
    this.isMonthly$.pipe(takeUntil(this.unsubscribeAll)).subscribe((isMonthly) => {
      this.loadGraphs(isMonthly);
    });
  }

  ngOnDestroy() {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }

  loadGraphs(isMonthly: boolean) {
    const lineX = (
      isMonthly
        ? this.indexCorrelationStoreService.comparisonChartsData!.index_1_monthly_price
        : this.indexCorrelationStoreService.comparisonChartsData!.index_1_price
    ).map((item) => item.stable_assigned_date);
    const lineY = (
      isMonthly
        ? this.indexCorrelationStoreService.comparisonChartsData!.index_1_monthly_price
        : this.indexCorrelationStoreService.comparisonChartsData!.index_1_price
    ).map((item) => item.price);
    const line2X = (
      isMonthly
        ? this.indexCorrelationStoreService.comparisonChartsData!.index_2_monthly_price
        : this.indexCorrelationStoreService.comparisonChartsData!.index_2_price
    ).map((item) => item.stable_assigned_date);
    const line2Y = (
      isMonthly
        ? this.indexCorrelationStoreService.comparisonChartsData!.index_2_monthly_price
        : this.indexCorrelationStoreService.comparisonChartsData!.index_2_price
    ).map((item) => item.price);

    const scatterX = (
      isMonthly
        ? this.indexCorrelationStoreService.comparisonChartsData!.monthly_scatter_data
        : this.indexCorrelationStoreService.comparisonChartsData!.scatter_data
    ).x;
    const scatterY = (
      isMonthly
        ? this.indexCorrelationStoreService.comparisonChartsData!.monthly_scatter_data
        : this.indexCorrelationStoreService.comparisonChartsData!.scatter_data
    ).y;
    const { sl, off, r2 } = linearRegression(scatterX, scatterY);
    this.scatterPlotLayout = {
      title: { text: '<b>Scatter Plot</b>', font: { color: 'grey' } },
      hovermode: 'closest',
      xaxis: { title: { text: this.indexCorrelationStoreService.indexCurrencyAndUnit1 } },
      yaxis: { title: { text: this.indexCorrelationStoreService.indexCurrencyAndUnit2 } },
      annotations: [
        {
          x: 0.98,
          y: 0.02,
          xanchor: 'right',
          yanchor: 'bottom',
          xref: 'paper',
          yref: 'paper',
          showarrow: false,
          text: `LR: Y = ${getDecimal(sl, 4)}X ${off >= 0 ? '+' : '-'} ${getDecimal(Math.abs(off), 4)}, R<sup>2</sup>: ${getDecimal(r2, 4)}`,
        }
      ]
    };
    this.scatterPlot = [
      {
        x: scatterX,
        y: scatterY,
        name: `${this.indexCorrelationStoreService.indexDetails1?.stable_index_code} - ${this.indexCorrelationStoreService.indexDetails2?.stable_index_code}`,
        type: PlotlyGraphTypes.Scatter,
        mode: PlotlyModeTypes.Markers,
        marker: { color: PlotlyTraceColors.Primary100, size: 2 },
      },
      {
        x: scatterX,
        y: scatterX.map((el) => off + el * sl),
        type: PlotlyGraphTypes.Scatter,
        mode: PlotlyModeTypes.Lines,
        name: 'Trend',
        line: { width: 1, dash: PlotlyLineDashTypes.Dash, color: PlotlyTraceColors.Accent100 },
      },
    ];
    this.refreshScatterPlotLayout$.next(this.scatterPlotLayout);

    this.seasonalityPlotLayout = {
      title: { text: '<b>Seasonality Plot</b>', font: { color: 'grey' } },
      hovermode: 'closest',
      boxmode: 'group',
      xaxis: { title: { text: 'Months' } },
      yaxis: {
        title: {
          text: this.indexCorrelationStoreService.indexCurrencyAndUnit1,
        },
      },
      yaxis2: {
        title: {
          text: this.indexCorrelationStoreService.indexCurrencyAndUnit2,
        },
      },
      margin: {
        r: 60
      }
    };
    this.seasonalityPlot = [
      {
        // Box Plot
        x: [...monthsOrder, ...lineX.map((date) => monthsOrder[new Date(date).getMonth()])],
        y: [...Array.from({ length: 12 }, (e, i) => null), ...lineY],
        type: PlotlyGraphTypes.Box,
        name: this.indexCorrelationStoreService.indexDetails1?.stable_index_code,
        marker: { color: PlotlyTraceColors.Primary100, size: 2 },
      },
      {
        // Box Plot
        x: [...monthsOrder, ...line2X.map((date) => monthsOrder[new Date(date).getMonth()])],
        y: [...Array.from({ length: 12 }, (e, i) => null), ...line2Y],
        type: PlotlyGraphTypes.Box,
        name: this.indexCorrelationStoreService.indexDetails2?.stable_index_code,
        marker: { color: PlotlyTraceColors.Accent100, size: 2 },
        yaxis: PlotlyAxisTypes.Y2,
      },
    ];
    this.refreshSeasonalityPlotLayout$.next(this.seasonalityPlotLayout);
  }
}
