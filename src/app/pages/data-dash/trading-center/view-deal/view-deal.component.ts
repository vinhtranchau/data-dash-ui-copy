import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import { addMonths } from 'date-fns';

import * as _ from 'lodash';

import { IndexPrice } from '../../../../core/models/index.model';
import { StatusType, TradeRequest } from '../../../../core/models/trading-center.model';
import { TradingCenterService } from '../../../../core/services/trading-center.service';
import { PlotlyData } from '../../../../ui-kit/graph-kit/plotly-chart.models';
import { LoadingSpinner } from '../../../../ui-kit/spinner/spinner';
import { addTimezone } from '../../../../core/utils/dates.util';
import {
  PlotlyFillTypes,
  PlotlyGraphTypes,
  PlotlyHoverInfoTypes,
  PlotlyLineDashTypes,
  PlotlyModeTypes,
  PlotlyTraceColors,
} from '../../../../ui-kit/graph-kit/plotly-chart.options';
import { dataDashRoute } from '../../../../core/routes/data-dash.route';
import { SidebarStatusService } from '../../../../layout/dashboard-layout/sidebar-status.service';

@Component({
  selector: 'dd-view-deal',
  templateUrl: './view-deal.component.html',
  styleUrls: ['./view-deal.component.scss'],
})
export class ViewDealComponent implements OnInit, OnDestroy {
  dataDashRoute = dataDashRoute;
  today: Date;
  tradeId: string;
  tradeRequest: TradeRequest;
  currencyAndUnit: string;

  hasError: boolean;
  spinner: LoadingSpinner<{ tradeRequest: boolean; indexPrices: boolean }>;

  indexPrices: IndexPrice[];
  dataX: string[];
  dataY: number[];
  startingLayout: any;
  lastPrice: number;
  plotData: PlotlyData[];
  refreshLayout$: Subject<any> = new Subject<any>();

  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private route: ActivatedRoute,
    private tradingCenterService: TradingCenterService,
    private sidebarStatusService: SidebarStatusService
  ) {}

  ngOnInit(): void {
    this.today = new Date();
    this.startingLayout = {
      xaxis: {
        title: { text: 'Dates' },
        range: [
          addTimezone(addMonths(new Date(), -9)),
          new Date(this.today.getFullYear(), this.today.getMonth() + 4, 0),
        ],
      },
      margin: { r: 5, t: 10 },
    };
    const params = this.route.snapshot.params;
    const { id } = params;
    this.tradeId = id;

    this.hasError = false;
    this.spinner = new LoadingSpinner({
      tradeRequest: 'Loading trade details...',
      indexPrices: 'Loading index prices...',
    });

    this.loadTrade();

    this.sidebarStatusService.isOpen$
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe((status) => setTimeout(() => this.refreshLayout(), 500));
  }

  async loadTrade() {
    try {
      this.spinner.loaders.tradeRequest.show();
      this.tradeRequest = await firstValueFrom(this.tradingCenterService.getTradeRequest(this.tradeId));

      if (
        ![StatusType.Purchase, StatusType.Live, StatusType.Settled, StatusType.Watch, StatusType.Bid].includes(
          this.tradeRequest.status
        )
      ) {
        throw 'No permission to access trade request of this status type.';
      }

      this.currencyAndUnit =
        this.tradeRequest.index.stable_index_code +
        ' ' +
        this.tradeRequest.index.currency_id.code +
        (this.tradeRequest.index.is_currency_cents ? ' (Cents) / ' : ' / ') +
        (this.tradeRequest.index.unit_multiplier !== 1 ? this.tradeRequest.index.unit_multiplier + ' ' : '') +
        this.tradeRequest.index.unit_id.units;

      this.loadIndexPrices();
    } catch (e) {
      this.hasError = true;
      this.spinner.loaders.indexPrices.hide();
    } finally {
      this.spinner.loaders.tradeRequest.hide();
    }
  }

  async loadIndexPrices() {
    try {
      this.spinner.loaders.indexPrices.show();
      this.indexPrices = await firstValueFrom(this.tradingCenterService.getIndexPrice(this.tradeRequest.index.id));
      this.loadPlot();
    } catch (e) {
      this.hasError = true;
    } finally {
      this.spinner.loaders.indexPrices.hide();
    }
  }

  loadPlot() {
    this.dataX = this.indexPrices.map((item) => item.stable_assigned_date);
    this.dataY = this.indexPrices.map((item) => item.price);

    this.lastPrice = this.dataY[this.dataY.length - 1];

    this.plotData = [
      {
        x: this.dataX,
        y: this.dataY,
        type: PlotlyGraphTypes.Scatter,
        mode: PlotlyModeTypes.LinesAndMarkers,
        name: this.tradeRequest.index?.stable_index_code,
        hoverinfo:
          this.tradeRequest.index.public_access_level === 5
            ? PlotlyHoverInfoTypes.Skip
            : PlotlyHoverInfoTypes.LabelAndValue,
        fill: PlotlyFillTypes.ToZeroY,
        fillcolor: PlotlyTraceColors.Transparent,
        line: { color: PlotlyTraceColors.Primary100, width: 2 },
        marker: { color: PlotlyTraceColors.Primary100, size: 2 },
      },
      {
        x: [this.tradeRequest.coverage_start_in, this.tradeRequest.coverage_end_in],
        y: [parseFloat(this.tradeRequest.strike), parseFloat(this.tradeRequest.strike)],
        type: PlotlyGraphTypes.Scatter,
        mode: PlotlyModeTypes.Lines,
        name: 'Strike',
        line: { width: 2, dash: PlotlyLineDashTypes.DashDot, color: PlotlyTraceColors.Accent100 },
      },
      {
        x: [this.tradeRequest.coverage_start_in, this.tradeRequest.coverage_end_in],
        y: [parseFloat(this.tradeRequest.limit), parseFloat(this.tradeRequest.limit)],
        type: PlotlyGraphTypes.Scatter,
        mode: PlotlyModeTypes.Lines,
        name: 'Limit',
        line: { width: 2, dash: PlotlyLineDashTypes.DashDot, color: PlotlyTraceColors.Accent100 },
      },
    ];
  }

  refreshLayout() {
    const contractConfigLayout = {
      shapes: [
        {
          type: 'line',
          x0: this.tradeRequest.purchase_watch_status_time || '',
          x1: this.tradeRequest.purchase_watch_status_time || '',
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
          x0: this.tradeRequest.coverage_start_in,
          x1: this.tradeRequest.coverage_end_in,
          y0: parseFloat(this.tradeRequest.strike),
          y1: parseFloat(this.tradeRequest.limit),
          line: {
            width: 0,
          },
          fillcolor: PlotlyTraceColors.TransparentPrimary,
        },
      ],
    };
    this.startingLayout = _.merge(this.startingLayout, contractConfigLayout);

    this.startingLayout = _.merge(this.startingLayout, {
      xaxis: {
        rangeslider: {
          range: [this.dataX[0], this.dataX[this.dataX.length - 1]],
        },
      },
      yaxis: { title: { text: this.currencyAndUnit } },
    });

    this.refreshLayout$.next(this.startingLayout);
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }
}
