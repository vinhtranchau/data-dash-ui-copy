import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import * as _ from 'lodash';

import { ClientIndex, ContractType } from '../../../../../core/models/trading-center.model';
import { TradingCenterService } from '../../../../../core/services/trading-center.service';
import { PlotlyData } from '../../../../../ui-kit/graph-kit/plotly-chart.models';
import {
  PlotlyAxisTypes,
  PlotlyFillTypes,
  PlotlyGraphTypes,
  PlotlyHoverInfoTypes,
  PlotlyLineDashTypes,
  PlotlyModeTypes,
  PlotlyTraceColors,
} from '../../../../../ui-kit/graph-kit/plotly-chart.options';
import { SidebarStatusService } from '../../../../../layout/dashboard-layout/sidebar-status.service';
import {
  AdditionalOptionsForm,
  AdditionalOptionsFormGroup,
  IndividualContractConfigForm,
  individualContractConfigFormGroup,
  ContractConfigFormValue,
} from '../../../../../core/strict-typed-forms/trading-center.form';
import { linearRegression } from '../../../../../core/utils/linear-regression.util';
import { windowPeriodFromFrequency } from '../../../../../ui-kit/graph-kit/plotly-chart.utils';
import { movingAverage } from '../../../../../core/utils/moving-average.util';
import { getDecimal } from '../../../../../core/utils/number.util';
import { addMonths, getCoverageEnd, getCoverageStart, addTimezone } from '../../../../../core/utils/dates.util';
import { TradeIndexCorrelationPairExtended } from './../correlated-indexes-table/correlated-indexes-table.config';
import { PlotRelayoutEvent } from 'plotly.js';
import { getCurrencyAndUnit } from '../../../../../core/utils/index-detail.util';
import { ToastService } from '../../../../../ui-kit/toast/toast.service';
import { PlotlyService } from 'angular-plotly.js';
import { IndexPrice } from '../../../../../core/models/index.model';

@Component({
  selector: 'dd-individual-contract',
  templateUrl: './individual-contract.component.html',
  styleUrls: ['./individual-contract.component.scss'],
})
export class IndividualContractComponent implements OnInit, OnDestroy {
  @Input() indexPrices: IndexPrice[];
  @Input() indexDetails: ClientIndex;

  additionalOptionsForm: FormGroup<AdditionalOptionsForm> = this.fb.nonNullable.group({
    ...AdditionalOptionsFormGroup,
  });
  individualContractConfigForm: FormGroup<IndividualContractConfigForm> = this.fb.nonNullable.group({
    ...individualContractConfigFormGroup(),
  });
  contractType = ContractType;

  plotlyGraph: any;
  plotDivId = 'trading-center-plot';
  setXAxis: any;

  lastPrice = 10000;

  dataX: string[] = [];
  dataY: number[] = [];
  secondaryDataX: string[] = [];
  secondaryDataY: number[] = [];

  secondaryIndex: TradeIndexCorrelationPairExtended;
  currencyAndUnit: string;
  secondaryCurrencyAndUnit: string;
  plotMax: number;
  plotMin: number;
  plotRange: number;

  startingLayout = {};
  plotData: PlotlyData[];
  plotLayout = {};
  refreshLayout$: Subject<any> = new Subject<any>();

  private unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private tradingCenterService: TradingCenterService,
    private sidebarStatusService: SidebarStatusService,
    private fb: FormBuilder,
    private toastService: ToastService,
    private plotlyService: PlotlyService
  ) {
    plotlyService.getPlotly().then((plotly) => (this.plotlyGraph = plotly));
  }

  async ngOnInit() {
    this.setXAxis = [addMonths(new Date(), -9), new Date(new Date().getFullYear(), new Date().getMonth() + 4, 0)];

    this.parseIndexPrice();
    this.parseIndexDetails();

    // Refresh layout on sidebar toggle
    this.sidebarStatusService.isOpen$
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(() => setTimeout(() => this.refreshLayout$.next(this.plotLayout), 500));

    // Reload plot after any additional options change
    this.additionalOptionsForm.valueChanges.pipe(takeUntil(this.unsubscribeAll)).subscribe(() => this.loadPlot());

    this.individualContractConfigForm.get('limit')?.addValidators(Validators.max(2 * this.lastPrice));
    this.individualContractConfigForm.get('strike')?.addValidators(Validators.max(2 * this.lastPrice));
    this.individualContractConfigForm.get('limit')?.setValue(getDecimal(1.3 * this.lastPrice, 2));
    this.individualContractConfigForm.get('strike')?.setValue(getDecimal(1.1 * this.lastPrice, 2));

    // Refresh plot after any contract config change
    this.individualContractConfigForm.valueChanges
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(() => this.loadPlot());

    // Animation lags on indexes with long history and daily frequency, not using it for now
    // this.animatePlot();
    this.loadPlot();
  }

  private loadPlot() {
    this.plotLayout = {};
    this.plotLayout = _.merge(this.plotLayout, this.startingLayout);
    const mainPlot = {
      x: this.dataX,
      y: this.dataY,
      type: PlotlyGraphTypes.Scatter,
      mode: PlotlyModeTypes.LinesAndMarkers,
      name: this.indexDetails?.stable_index_code,
      hoverinfo:
        this.indexDetails.public_access_level === 5 ? PlotlyHoverInfoTypes.Skip : PlotlyHoverInfoTypes.LabelAndValue,
      fill: PlotlyFillTypes.ToZeroY,
      fillcolor: PlotlyTraceColors.Transparent,
      line: { color: PlotlyTraceColors.Primary100, width: 2 },
      marker: { color: PlotlyTraceColors.Primary100, size: 2 },
    };
    this.plotData = [mainPlot];

    if (this.secondaryIndex && this.secondaryDataX.length) {
      this.plotData = [
        ...this.plotData,
        {
          x: this.secondaryDataX,
          y: this.secondaryDataY,
          yaxis: PlotlyAxisTypes.Y2,
          type: PlotlyGraphTypes.Scatter,
          mode: PlotlyModeTypes.LinesAndMarkers,
          name: this.secondaryIndex.stable_index_code,
          hoverinfo:
            this.secondaryIndex.correlated_index.public_access_level === 5
              ? PlotlyHoverInfoTypes.Skip
              : PlotlyHoverInfoTypes.LabelAndValue,
          fill: PlotlyFillTypes.ToZeroY,
          fillcolor: PlotlyTraceColors.Transparent,
          line: { color: PlotlyTraceColors.Accent100, width: 2 },
          marker: { color: PlotlyTraceColors.Accent100, size: 2 },
        },
      ];
    }

    if (this.additionalOptionsForm.value['12m_ma']) {
      this.plotData = [...this.plotData, this.calcMovingAverage(12)];
    }

    if (this.additionalOptionsForm.value['24m_ma']) {
      this.plotData = [...this.plotData, this.calcMovingAverage(24)];
    }

    if (this.additionalOptionsForm.value['trend']) {
      this.plotData = [...this.plotData, this.calcIndexTrends()];
    }

    this.contractConfigPlot(this.individualContractConfigForm.getRawValue() as ContractConfigFormValue);

    if (this.secondaryIndex && this.secondaryDataX.length) {
      const min = Math.min(...this.secondaryDataY.filter((value) => value));
      const max = Math.max(...this.secondaryDataY.filter((value) => value));
      const range = max - min;
      this.plotLayout = _.merge(this.plotLayout, {
        margin: { r: 60 },
        yaxis2: {
          visible: true,
          title: {
            text: this.secondaryCurrencyAndUnit,
          },
          range: [min - 0.05 * range, max + 0.2 * range],
        },
      });
    }

    if (this.setXAxis) {
      this.plotLayout = _.merge(this.plotLayout, {
        xaxis: { range: this.setXAxis },
      });
    }

    this.refreshLayout$.next(this.plotLayout);
  }

  onSelectCorrelation(correlatedIndex: TradeIndexCorrelationPairExtended) {
    this.secondaryIndex = correlatedIndex;
    this.secondaryCurrencyAndUnit = getCurrencyAndUnit(this.secondaryIndex.correlated_index, true);
    this.getSecondaryIndexPrices(correlatedIndex.correlated_index.id).then();
  }

  private async parseIndexPrice() {
    try {
      this.dataX = this.indexPrices.map((item) => item.stable_assigned_date);
      this.dataY = this.indexPrices.map((item) => item.price);

      this.lastPrice = this.dataY[this.dataY.length - 1];

      this.plotMax = Math.max(...this.dataY.filter((value) => value));
      this.plotMin = Math.min(...this.dataY.filter((value) => value));
      this.plotRange = this.plotMax - this.plotMin;

      this.startingLayout = _.merge(this.startingLayout, {
        xaxis: {
          rangeslider: {
            range: [this.dataX[0], this.dataX[this.dataX.length - 1]],
          },
        },
        yaxis: { range: [this.plotMin - 0.05 * this.plotRange, this.plotMax + 0.2 * this.plotRange] },
      });
    } catch (e) {
    } finally {
    }
  }

  private async getSecondaryIndexPrices(indexId: string) {
    try {
      const prices = await firstValueFrom(this.tradingCenterService.getIndexPrice(indexId));
      this.secondaryDataX = [];
      this.secondaryDataY = [];
      prices
        .filter((item) => new Date(item.stable_assigned_date) > new Date(this.dataX[0]))
        .map((item) => {
          this.secondaryDataX.push(item.stable_assigned_date);
          this.secondaryDataY.push(item.price);
        });
      this.loadPlot();
    } catch (e) {
      this.toastService.error('Failed to load secondary index.');
    } finally {
    }
  }

  private async parseIndexDetails() {
    try {
      this.currencyAndUnit = getCurrencyAndUnit(this.indexDetails, true);

      this.startingLayout = _.merge(this.startingLayout, {
        xaxis: {
          title: { text: 'Dates' },
        },
        yaxis: { title: { text: this.currencyAndUnit } },
        margin: { t: 10, r: 5 },
      });
    } catch (e) {
    } finally {
    }
  }

  private calcIndexTrends(): PlotlyData {
    const { sl, off } = linearRegression(
      [...Array(this.dataY!.length).keys()], // Array of 1, 2, ..., y.length
      this.dataY!
    );

    return {
      x: this.dataX,
      y: [...Array(this.dataY!.length).keys()].map((el) => off + el * sl),
      type: PlotlyGraphTypes.Scatter,
      mode: PlotlyModeTypes.Lines,
      name: 'Trend',
      line: { width: 1, dash: PlotlyLineDashTypes.Dot, color: PlotlyTraceColors.MidnightBlue },
    };
  }

  private calcMovingAverage(months: number): PlotlyData {
    const windowPeriod = windowPeriodFromFrequency(this.indexDetails.price_frequency, months);
    const movingAverageY = movingAverage(this.dataY!, windowPeriod);
    return {
      x: this.dataX,
      y: movingAverageY,
      name: `${months}M MA`,
      type: PlotlyGraphTypes.Scatter,
      mode: PlotlyModeTypes.Lines,
      line: { width: 1, dash: PlotlyLineDashTypes.Dot, color: PlotlyTraceColors.MidnightBlue },
    };
  }

  private contractConfigPlot(formValue: ContractConfigFormValue) {
    const startingDate = getCoverageStart(formValue.start_month_delta);
    const endingDate = getCoverageEnd(formValue.end_month_delta);

    this.plotData = [
      ...this.plotData,
      {
        x: [startingDate, endingDate],
        y: [formValue.strike, formValue.strike],
        type: PlotlyGraphTypes.Scatter,
        mode: PlotlyModeTypes.Lines,
        name: 'Strike',
        line: { width: 2, dash: PlotlyLineDashTypes.DashDot, color: PlotlyTraceColors.Accent100 },
      },
      {
        x: [startingDate, endingDate],
        y: [formValue.limit, formValue.limit],
        type: PlotlyGraphTypes.Scatter,
        mode: PlotlyModeTypes.Lines,
        name: 'Limit',
        line: { width: 2, dash: PlotlyLineDashTypes.DashDot, color: PlotlyTraceColors.Accent100 },
      },
    ];

    this.plotMax = Math.max(...this.dataY.filter((value) => value));
    this.plotMin = Math.min(...this.dataY.filter((value) => value));
    this.plotMax = Math.max(formValue.strike, formValue.limit, this.plotMax);
    this.plotMin = Math.min(formValue.strike, formValue.limit, this.plotMin);
    this.plotRange = this.plotMax - this.plotMin;

    const contractConfigLayout = {
      yaxis: { range: [this.plotMin - 0.05 * this.plotRange, this.plotMax + 0.2 * this.plotRange] },
      shapes: [
        ...[...Array(4 - formValue.start_month_delta).keys()].map((number) => ({
          type: 'line',
          x0: addTimezone(addMonths(startingDate, number)),
          x1: addTimezone(addMonths(startingDate, number)),
          y0: 0,
          y1: 1,
          yref: 'paper',
          line: {
            color: 'grey',
            width: 1,
            dash: 'dot',
          },
        })),
        {
          type: 'rect',
          x0: addTimezone(startingDate),
          x1: addTimezone(endingDate),
          y0: formValue.strike,
          y1: formValue.limit,
          line: {
            width: 0,
          },
          fillcolor: PlotlyTraceColors.TransparentPrimary,
        },
        {
          type: 'rect',
          x0: this.dataX[0],
          x1: addTimezone(endingDate),
          y0: formValue.strike,
          y1: formValue.limit,
          line: {
            width: 0,
          },
          fillcolor: PlotlyTraceColors.TransparentPrimary200,
        },
      ],
    };
    this.plotLayout = _.merge(this.plotLayout, contractConfigLayout);
  }

  graphRelayout(event: PlotRelayoutEvent) {
    if (event['xaxis.autorange']) {
      this.setXAxis = null;
    } else if (event['xaxis.range']) {
      this.setXAxis = [event['xaxis.range'][0], event['xaxis.range'][1]];
    } else if (event['xaxis.range[0]']) {
      this.setXAxis = [event['xaxis.range[0]'], event['xaxis.range[1]']];
    }
  }

  private animatePlot() {
    this.plotLayout = {};
    this.plotLayout = _.merge(this.plotLayout, this.startingLayout);
    this.plotLayout = _.merge(this.plotLayout, {
      xaxis: { range: [addMonths(new Date(), -9), addMonths(new Date(this.dataX[this.dataX.length - 1]), 1)] },
    });
    this.refreshLayout$.next(this.plotLayout);

    const mainPlot = {
      x: this.dataX,
      y: this.dataY.map((x) => null),
      type: PlotlyGraphTypes.Scatter,
      mode: PlotlyModeTypes.LinesAndMarkers,
      name: this.indexDetails?.stable_index_code,
      hoverinfo:
        this.indexDetails.public_access_level === 5 ? PlotlyHoverInfoTypes.Skip : PlotlyHoverInfoTypes.LabelAndValue,
      fill: PlotlyFillTypes.ToZeroY,
      fillcolor: PlotlyTraceColors.Transparent,
      line: { color: PlotlyTraceColors.Primary100, width: 2, simplify: false },
      marker: { color: PlotlyTraceColors.Primary100, size: 2 },
    };
    this.plotData = [mainPlot];

    const rangeLength = this.dataX.filter((date) => {
      return new Date(date) > addMonths(new Date(), -9);
    }).length;
    const count = this.dataY.length - rangeLength;
    const increase = rangeLength / 40;
    setTimeout(() => {
      this.animate(count, increase);
    }, 100);
  }

  animate(count: number, increase: number) {
    if (count <= this.dataY.length) {
      this.plotlyGraph.animate(
        this.plotDivId,
        {
          data: [{ x: this.dataX.slice(0, Math.ceil(count)), y: this.dataY.slice(0, Math.ceil(count)) }],
        },
        {
          transition: {
            duration: 0,
          },
          frame: {
            duration: 10,
            redraw: false,
          },
        }
      );

      requestAnimationFrame(() => {
        this.animate(count + increase, increase);
      });
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }
}
