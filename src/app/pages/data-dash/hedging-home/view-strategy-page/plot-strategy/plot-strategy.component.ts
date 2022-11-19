import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { addMonths } from 'date-fns';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';

import { DealDetail, DealDirection, HedgingStrategyDetail } from '../../../../../core/models/hedging.model';
import { Index, IndexPrice } from '../../../../../core/models/index.model';
import { Plot, SgEng } from '../../../../../core/models/quant.model';
import { QuantService } from '../../../../../core/services/quant.service';
import { PlotlyData } from '../../../../../ui-kit/graph-kit/plotly-chart.models';
import {
  PlotlyAxisTypes,
  PlotlyFillTypes,
  PlotlyGraphTypes,
  PlotlyModeTypes,
  PlotlyTraceColors,
} from '../../../../../ui-kit/graph-kit/plotly-chart.options';
import { parseIndexPrices } from '../../../../../ui-kit/graph-kit/plotly-chart.utils';
import { ToastService } from '../../../../../ui-kit/toast/toast.service';

@Component({
  selector: 'dd-plot-strategy',
  templateUrl: './plot-strategy.component.html',
  styleUrls: ['./plot-strategy.component.scss'],
})
export class PlotStrategyComponent implements OnInit, OnDestroy {
  @Input() indexPrices: IndexPrice[];
  @Input() index: Index | undefined;
  @Input() dealConfig: DealDetail | undefined;
  @Input() refreshPlots$: Subject<any>;

  selectedStrategyDetail: HedgingStrategyDetail;

  refreshLayout$: Subject<any> = new Subject<any>();

  futures_code: string;
  delivery_month: string;
  px_last: number;
  plotData: Plot;

  isLoading = false;
  isLoadingForecast = false;

  indexPlot: PlotlyData;

  forecastUpperBound: number[] = [];
  forecastLowerBound: number[] = [];
  pxAvg: number[];
  high: number[];
  low: number[];
  dates: string[];
  volume: number[];
  data: PlotlyData[];

  private unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private quantService: QuantService, private toast: ToastService) {}

  async ngOnInit() {
    this.refreshPlots$.pipe(takeUntil(this.unsubscribeAll)).subscribe((hedgingStrategy: HedgingStrategyDetail) => {
      this.selectedStrategyDetail = hedgingStrategy;
      this.futures_code = this.selectedStrategyDetail.futures_code;
      this.delivery_month = this.selectedStrategyDetail.delivery_month;
      this.px_last = this.selectedStrategyDetail.px_last;
      this.loadPlotData();
    });
  }

  private loadIndexGraph() {
    const { x, y, hoverTemplate } = parseIndexPrices(this.indexPrices);

    this.indexPlot = {
      x,
      y,
      hovertemplate: hoverTemplate,
      type: PlotlyGraphTypes.Scatter,
      mode: PlotlyModeTypes.LinesAndMarkers,
      name: this.index?.stable_index_code,
      fill: PlotlyFillTypes.ToZeroY,
      fillcolor: PlotlyTraceColors.Transparent,
      line: { color: PlotlyTraceColors.Gold, width: 2 },
      marker: { color: PlotlyTraceColors.Gold, size: 2 },
    };
  }

  async loadPlotData() {
    this.isLoading = true;
    if (!this.indexPlot) {
      this.loadIndexGraph();
    }
    this.plotData = await firstValueFrom(
      this.quantService.getInstrumentFutsPlot(this.futures_code, this.delivery_month)
    );
    // Load backtest forecast
    const forecastData = await this.loadForecast();
    // Handle curve data
    const { candle, curve } = this.plotData;
    this.pxAvg = curve.map((x) => x.px_last);
    // Handle candle data
    const curveDates = curve.map((x) => x.last_tradable_date);
    const open = candle.map((x) => x.px_open);
    const close = candle.map((x) => x.px_last);
    this.high = candle.map((x) => x.px_high);
    this.low = candle.map((x) => x.px_low);
    this.dates = candle.map((x) => x.settle_date);

    // Add curves for the future
    this.dates = [...this.dates, ...curveDates];
    this.volume = candle.map((x) => x.volume);

    this.data = [
      {
        type: PlotlyGraphTypes.Candlestick,
        x: this.dates,
        open: open,
        high: this.high,
        low: this.low,
        close: close,
        increasing: { line: { color: PlotlyTraceColors.Primary100, width: 1 } },
        decreasing: { line: { color: PlotlyTraceColors.Accent100, width: 1 } },
        name: this.selectedStrategyDetail.contract_code,
        yaxis: PlotlyAxisTypes.Y2,
      },
      {
        x: curveDates,
        y: this.pxAvg,
        name: 'Futures Curve',
        type: PlotlyGraphTypes.Scatter,
        mode: PlotlyModeTypes.Lines,
        line: { color: PlotlyTraceColors.NavyBlue, width: 1 },
        yaxis: PlotlyAxisTypes.Y2,
      },
      ...forecastData,
      this.indexPlot,
    ];

    this.refreshLayout();
    this.isLoading = false;
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }

  private async loadForecast(): Promise<PlotlyData[]> {
    try {
      this.isLoadingForecast = true;
      const forecasts = await firstValueFrom(
        this.quantService.getInstrumentFutsForecast(this.futures_code, SgEng.Backtest, this.px_last)
      );
      const dates = forecasts.map((x) => x.date);
      this.forecastUpperBound = forecasts.map((x) => x.upper_bound);
      this.forecastLowerBound = forecasts.map((x) => x.lower_bound);
      const config = {
        x: dates,
        type: PlotlyGraphTypes.Scatter,
        mode: PlotlyModeTypes.Lines,
        yaxis: PlotlyAxisTypes.Y2,
      };
      return [
        {
          y: forecasts.map((x) => x.mean),
          name: 'Forecasted Price',
          line: { color: PlotlyTraceColors.MidnightBlue, width: 2 },
          ...config,
        },
        {
          y: this.forecastUpperBound,
          name: 'Forecasted Price Upper Bound (95% CL)',
          line: { color: PlotlyTraceColors.Transparent, width: 0 },
          ...config,
        },
        {
          y: this.forecastLowerBound,
          name: 'Forecasted Price Lower Bound (95% CL)',
          line: { color: PlotlyTraceColors.Transparent, width: 0 },
          fill: PlotlyFillTypes.ToNextY,
          fillcolor: PlotlyTraceColors.TransparentGray,
          ...config,
        },
      ];
    } catch (e) {
      this.toast.error('Failed to load forecast information!');
      return [];
    } finally {
      this.isLoadingForecast = false;
    }
  }

  private refreshLayout() {
    if (!this.dealConfig || !this.index) {
      return;
    }
    const maxHigh = Math.max(...(this.high ? this.high : [2]), ...this.pxAvg, ...this.forecastUpperBound);
    const minLow = Math.min(
      ...[...(this.low ? this.low : [1]), ...this.pxAvg, ...this.forecastLowerBound].filter((value) => value)
    );
    const range = maxHigh - minLow;
    const topRange = 0.25 * range + maxHigh;
    const bottomRange = topRange - range / 0.6;

    const plotLayout = {
      xaxis: {
        title: { text: 'Dates' },
        range: [addMonths(new Date(), -6), addMonths(new Date(), 4)],
      },
      yaxis: {
        title: { text: this.index.stable_index_code },
      },
      yaxis2: {
        title: { text: this.selectedStrategyDetail.contract_code },
        range: [bottomRange, topRange],
      },
      margin: { r: 60, t: 5, b: 0 },
      shapes: [
        {
          type: 'line',
          x0: this.dealConfig.purchase_date,
          x1: this.dealConfig.purchase_date,
          y0: 0,
          y1: 1,
          yref: 'paper',
          line: {
            color: 'grey',
            width: 1,
            dash: 'dot',
          },
        },
        {
          type: 'line',
          x0: this.dealConfig.coverage_start,
          x1: this.dealConfig.coverage_start,
          y0: 0,
          y1: 1,
          yref: 'paper',
          line: {
            color: 'grey',
            width: 1,
            dash: 'dot',
          },
        },
        {
          type: 'line',
          x0: this.dealConfig.coverage_end,
          x1: this.dealConfig.coverage_end,
          y0: 0,
          y1: 1,
          yref: 'paper',
          line: {
            color: 'grey',
            width: 1,
            dash: 'dot',
          },
        },
        {
          type: 'rect',
          x0: 0,
          x1: 1,
          y0: this.dealConfig.strike,
          y1: this.dealConfig.limit,
          xref: 'paper',
          line: {
            width: 0,
          },
          fillcolor: PlotlyTraceColors.TransparentPrimary,
        },
      ],
      annotations: [
        {
          yref: 'paper',
          x: this.dealConfig.purchase_date,
          y: 0.005,
          yanchor: 'bottom',
          xanchor: 'left',
          text: 'Purchase Date',
          showarrow: false,
          font: { color: PlotlyTraceColors.Dark, size: 6 },
        },
        {
          yref: 'paper',
          x: this.dealConfig.coverage_start,
          y: 0.005,
          yanchor: 'bottom',
          xanchor: 'left',
          text: 'Coverage Start',
          showarrow: false,
          font: { color: PlotlyTraceColors.Dark, size: 6 },
        },
        {
          yref: 'paper',
          x: this.dealConfig.coverage_end,
          y: 0.005,
          yanchor: 'bottom',
          xanchor: 'left',
          text: 'Coverage End',
          showarrow: false,
          font: { color: PlotlyTraceColors.Dark, size: 6 },
        },
        {
          xref: 'paper',
          x: 0.005,
          y: this.dealConfig.strike,
          yanchor: this.dealConfig.direction === DealDirection.Call ? 'top' : 'bottom',
          xanchor: 'left',
          text: 'Strike',
          showarrow: false,
          font: { color: PlotlyTraceColors.Dark, size: 6 },
        },
        {
          xref: 'paper',
          x: 0.005,
          y: this.dealConfig.limit,
          yanchor: this.dealConfig.direction === DealDirection.Call ? 'bottom' : 'top',
          xanchor: 'left',
          text: 'Limit',
          showarrow: false,
          font: { color: PlotlyTraceColors.Dark, size: 6 },
        },
      ],
    };

    this.refreshLayout$.next(plotLayout);
  }
}
