import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';

import { Forecast, Future, Plot, SgEng } from '../../../../core/models/quant.model';
import { addMonths } from '../../../../core/utils/dates.util';
import { SidebarStatusService } from '../../../../layout/dashboard-layout/sidebar-status.service';
import { PlotlyData } from '../../../../ui-kit/graph-kit/plotly-chart.models';
import {
  PlotlyAxisTypes,
  PlotlyFillTypes,
  PlotlyGraphTypes,
  PlotlyModeTypes,
  PlotlyTraceColors,
} from '../../../../ui-kit/graph-kit/plotly-chart.options';
import { QuantService } from '../../../../core/services/quant.service';
import { ToastService } from '../../../../ui-kit/toast/toast.service';

@Component({
  selector: 'dd-trade-graph-panel',
  templateUrl: './trade-graph-panel.component.html',
  styleUrls: ['./trade-graph-panel.component.scss'],
})
export class TradeGraphPanelComponent implements OnInit, OnDestroy {
  @Input() future: Future;
  @Input() plots$: Subject<Plot> = new Subject<Plot>();
  @Input() isLoading = false;
  @Input() hasLoadError = false;

  data: PlotlyData[] = [];
  refreshLayout$ = new Subject<any>();
  volume: number[];
  low: number[];
  high: number[];
  pxAvg: number[];
  dates: string[];

  forecasts: Forecast[] = [];
  forecastUpperBound: number[] = [];
  forecastLowerBound: number[] = [];

  isLoadingForecast = false;

  private unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private sidebarStatusService: SidebarStatusService,
    private quantService: QuantService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.plots$.pipe(takeUntil(this.unsubscribeAll)).subscribe(async (plots) => {
      // Load backtest forecast
      const forecastData = await this.loadForecast();
      // Handle curve data
      const { candle, curve } = plots;
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
          name: this.future.contract_code,
        },
        {
          x: curveDates,
          y: this.pxAvg,
          name: 'Futures Curve',
          type: PlotlyGraphTypes.Scatter,
          mode: PlotlyModeTypes.Lines,
          line: { color: PlotlyTraceColors.NavyBlue, width: 1 },
          yaxis: PlotlyAxisTypes.Y,
        },
        {
          x: this.dates,
          y: this.volume,
          type: PlotlyGraphTypes.Bar,
          name: 'Volume',
          marker: { color: PlotlyTraceColors.BabyBlue, line: { width: 0 } },
          yaxis: PlotlyAxisTypes.Y2,
        },
        ...forecastData,
      ];

      this.refreshLayout();
    });

    this.sidebarStatusService.isOpen$
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((status) => setTimeout(() => this.refreshLayout(), 500));
  }

  ngOnDestroy() {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }

  private async loadForecast(): Promise<PlotlyData[]> {
    try {
      this.isLoadingForecast = true;
      const { futures_code, px_last } = this.future;
      const forecasts = await firstValueFrom(
        this.quantService.getInstrumentFutsForecast(futures_code, SgEng.Backtest, px_last)
      );
      const dates = forecasts.map((x) => x.date);
      this.forecastUpperBound = forecasts.map((x) => x.upper_bound);
      this.forecastLowerBound = forecasts.map((x) => x.lower_bound);
      const config = {
        x: dates,
        type: PlotlyGraphTypes.Scatter,
        mode: PlotlyModeTypes.Lines,
        yaxis: PlotlyAxisTypes.Y,
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
    if (!this.future || !this.dates.length) {
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
        range: [addMonths(new Date(), -3), addMonths(new Date(), 2)],
        rangebreaks: [{ bounds: ['sat', 'mon'] }],
      },
      yaxis: {
        title: { text: this.future.contract_code },
        range: [bottomRange, topRange],
      },
      yaxis2: {
        title: { text: 'Volume' },
        range: [0, 5 * Math.max(...(this.volume ? this.volume : [1]))],
      },
      margin: { r: 60, t: 5, b: 0 },
      annotations: [
        {
          xref: 'paper',
          yref: 'paper',
          x: 0.5,
          y: 0.98,
          yanchor: 'top',
          xanchor: 'center',
          text: `<b style='font-size: 18px'>Contract: ${this.future.contract_code}</b><br>${this.future.futures_code} - ${this.future.description}`,
          showarrow: false,
          font: { color: PlotlyTraceColors.Dark, size: 12 },
        },
      ],
    };

    this.refreshLayout$.next(plotLayout);
  }
}
