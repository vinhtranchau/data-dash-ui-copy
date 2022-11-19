import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, filter, firstValueFrom, Subject, takeUntil } from 'rxjs';
import { PlotlyData } from '../../../../ui-kit/graph-kit/plotly-chart.models';
import {
  PlotlyFillTypes,
  PlotlyGraphTypes,
  PlotlyHistNormTypes,
  PlotlyHoverInfoTypes,
  PlotlyLineDashTypes,
  PlotlyModeTypes,
  PlotlyTraceColors,
} from '../../../../ui-kit/graph-kit/plotly-chart.options';
import { IndexCorrelationStoreService } from '../../index-correlation-store.service';

@Component({
  selector: 'dd-basis-plots',
  templateUrl: './basis-plots.component.html',
  styleUrls: ['./basis-plots.component.scss'],
})
export class BasisPlotsComponent implements OnInit, OnDestroy {
  @Input() fullscreen: boolean;
  @Input() isMonthly$: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  @Input() isAdj: boolean = false;
  basisPlotLayout: any;
  basisPlot: PlotlyData[];
  refreshBasisPlotLayout$ = new Subject<any>();
  basisHistogramLayout: any;
  basisHistogramPlot: PlotlyData[];
  refreshBasisHistogramPlotLayout$ = new Subject<any>();
  basisAcfLayout: any;
  basisAcfPlot: PlotlyData[];
  refreshBasisAcfPlotLayout$ = new Subject<any>();
  // To check if empty basis
  basisY: number[] = [];
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
    let basisX: string[];
    let adj_coefficient: any;
    let histogramX: number[];
    let histogramY: number[];
    let basisAcf: number[];
    let basisPacf: number[];
    if (!this.isAdj) {
      basisX = (
        isMonthly
          ? this.indexCorrelationStoreService.comparisonChartsData!.monthly_basis_price
          : this.indexCorrelationStoreService.comparisonChartsData!.basis_price
      ).map((item) => item.stable_assigned_date);
      this.basisY = (
        isMonthly
          ? this.indexCorrelationStoreService.comparisonChartsData!.monthly_basis_price
          : this.indexCorrelationStoreService.comparisonChartsData!.basis_price
      ).map((item) => item.price);
      adj_coefficient = '';
      histogramX = isMonthly
        ? this.indexCorrelationStoreService.comparisonChartsData!.monthly_basis_histogram.x
        : this.indexCorrelationStoreService.comparisonChartsData!.basis_histogram.x;
      histogramY = isMonthly
        ? this.indexCorrelationStoreService.comparisonChartsData!.monthly_basis_histogram.y
        : this.indexCorrelationStoreService.comparisonChartsData!.basis_histogram.y;
      basisAcf = isMonthly
        ? this.indexCorrelationStoreService.comparisonChartsData!.monthly_basis_acf
        : this.indexCorrelationStoreService.comparisonChartsData!.basis_acf;
      basisPacf = isMonthly
        ? this.indexCorrelationStoreService.comparisonChartsData!.monthly_basis_pacf
        : this.indexCorrelationStoreService.comparisonChartsData!.basis_pacf;
    } else {
      basisX = (
        isMonthly
          ? this.indexCorrelationStoreService.comparisonChartsData!.monthly_adj_basis_price
          : this.indexCorrelationStoreService.comparisonChartsData!.adj_basis_price
      ).map((item) => item.stable_assigned_date);
      this.basisY = (
        isMonthly
          ? this.indexCorrelationStoreService.comparisonChartsData!.monthly_adj_basis_price
          : this.indexCorrelationStoreService.comparisonChartsData!.adj_basis_price
      ).map((item) => item.price);
      adj_coefficient =
        (isMonthly
          ? this.indexCorrelationStoreService.comparisonChartsData!.monthly_adj_basis_coefficient
          : this.indexCorrelationStoreService.comparisonChartsData!.adj_basis_coefficient) + ' *';
      histogramX = isMonthly
        ? this.indexCorrelationStoreService.comparisonChartsData!.monthly_adj_basis_histogram.x
        : this.indexCorrelationStoreService.comparisonChartsData!.adj_basis_histogram.x;
      histogramY = isMonthly
        ? this.indexCorrelationStoreService.comparisonChartsData!.monthly_adj_basis_histogram.y
        : this.indexCorrelationStoreService.comparisonChartsData!.adj_basis_histogram.y;
      basisAcf = isMonthly
        ? this.indexCorrelationStoreService.comparisonChartsData!.monthly_adj_basis_acf
        : this.indexCorrelationStoreService.comparisonChartsData!.adj_basis_acf;
      basisPacf = isMonthly
        ? this.indexCorrelationStoreService.comparisonChartsData!.monthly_adj_basis_pacf
        : this.indexCorrelationStoreService.comparisonChartsData!.adj_basis_pacf;
    }

    this.basisPlot = [
      {
        x: basisX,
        y: this.basisY,
        type: PlotlyGraphTypes.Scatter,
        mode: PlotlyModeTypes.Markers,
        name: `${this.indexCorrelationStoreService.indexDetails1?.stable_index_code} - ${adj_coefficient} ${this.indexCorrelationStoreService.indexDetails2?.stable_index_code}`,
        fill: PlotlyFillTypes.ToZeroY,
        fillcolor: PlotlyTraceColors.Transparent,
        marker: { color: PlotlyTraceColors.MidnightBlue, size: 2 },
      },
      {
        x: basisX,
        y: basisX.map((value) => 0),
        type: PlotlyGraphTypes.Scatter,
        mode: PlotlyModeTypes.Lines,
        hoverinfo: PlotlyHoverInfoTypes.Skip,
        name: '0 Line',
        line: { color: PlotlyTraceColors.MidnightBlue, width: 1, dash: PlotlyLineDashTypes.Dash },
      },
    ];
    this.basisPlotLayout = {
      title: { text: this.isAdj ? '<b>Adj Basis Plot</b>' : '<b>Basis Plot</b>', font: { color: 'grey' } },
      xaxis: {
        title: { text: 'Dates' },
      },
      yaxis: {
        title: {
          text: `${this.indexCorrelationStoreService.indexDetails1?.stable_index_code} - ${adj_coefficient} ${this.indexCorrelationStoreService.indexDetails2?.stable_index_code}`,
        },
      },
    };
    this.refreshBasisPlotLayout$.next(this.basisPlotLayout);

    this.basisHistogramPlot = [
      {
        x: this.basisY,
        nbinsx: Math.min(100, Math.floor(this.basisY.length / 3)),
        type: PlotlyGraphTypes.Histogram,
        name: 'Basis Histogram',
        histnorm: PlotlyHistNormTypes.ProbabilityDensity,
        marker: { color: PlotlyTraceColors.Accent100 },
      },
      {
        x: histogramX,
        y: histogramY,
        type: PlotlyGraphTypes.Scatter,
        mode: PlotlyModeTypes.Lines,
        name: 'Basis Distribution',
        line: { color: PlotlyTraceColors.Primary100, width: 2 },
      },
    ];
    this.basisHistogramLayout = {
      title: { text: '<b>Histogram Plot</b>', font: { color: 'grey' } },
      yaxis: {
        title: {
          text: 'Probability Density',
        },
      },
      xaxis: {
        title: {
          text: 'Basis'
        }
      }
    };
    this.refreshBasisHistogramPlotLayout$.next(this.basisHistogramLayout);

    this.basisAcfPlot = [
      {
        x: [...Array(basisAcf.length).keys()],
        y: basisAcf,
        type: PlotlyGraphTypes.Bar,
        name: 'ACF',
        marker: { color: PlotlyTraceColors.Primary100 },
      },
      {
        x: [...Array(basisPacf.length).keys()],
        y: basisPacf,
        type: PlotlyGraphTypes.Bar,
        name: 'PACF',
        marker: { color: PlotlyTraceColors.Accent100 },
      },
    ];
    this.basisAcfLayout = {
      title: { text: '<b>ACF/PACF Plot</b>', font: { color: 'grey' } },
      xaxis: { title: { text: 'Basis Lags' } },
      yaxis: { title: { text: 'Correlation' } },
    }
    this.refreshBasisAcfPlotLayout$.next(this.basisAcfLayout);
  }
}
