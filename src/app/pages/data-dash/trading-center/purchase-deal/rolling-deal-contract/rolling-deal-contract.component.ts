import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';

import * as _ from 'lodash';

import { IndexPrice } from '../../../../../core/models/index.model';
import { Option } from '../../../../../core/models/option.model';
import { ClientIndex, ContractType } from '../../../../../core/models/trading-center.model';
import { TradingCenterService } from '../../../../../core/services/trading-center.service';
import {
  AdditionalOptionsForm,
  AdditionalOptionsFormGroup,
  RollingDealContractConfigForm,
} from '../../../../../core/strict-typed-forms/trading-center.form';
import { addMonths, addTimezone, monthsDelta } from '../../../../../core/utils/dates.util';
import { getCurrencyAndUnit } from '../../../../../core/utils/index-detail.util';
import { linearRegression } from '../../../../../core/utils/linear-regression.util';
import { movingAverage } from '../../../../../core/utils/moving-average.util';
import { PlotlyData } from '../../../../../ui-kit/graph-kit/plotly-chart.models';
import { OptionTypes } from '../../../../../core/models/empirical-modelling.model';
import { RollingDealConfigurationData } from '../../../../../core/models/rolling-deal-configuration.model';
import {
  PlotlyAxisTypes,
  PlotlyFillTypes,
  PlotlyGraphTypes,
  PlotlyHoverInfoTypes,
  PlotlyLineDashTypes,
  PlotlyModeTypes,
  PlotlyTraceColors,
} from '../../../../../ui-kit/graph-kit/plotly-chart.options';
import { windowPeriodFromFrequency } from '../../../../../ui-kit/graph-kit/plotly-chart.utils';
import { ToastService } from '../../../../../ui-kit/toast/toast.service';
import { TradeIndexCorrelationPairExtended } from '../correlated-indexes-table/correlated-indexes-table.config';
import { SidebarStatusService } from '../../../../../layout/dashboard-layout/sidebar-status.service';
import { RollingDealConfigurationService } from '../../../../../core/services/rolling-deal-configuration.service';

@Component({
  selector: 'dd-rolling-deal-contract',
  templateUrl: './rolling-deal-contract.component.html',
  styleUrls: ['./rolling-deal-contract.component.scss'],
})
export class RollingDealContractComponent implements OnInit, OnDestroy {
  @Input() indexPrices: IndexPrice[];
  @Input() indexDetails: ClientIndex;

  plotData: PlotlyData[];
  refreshLayout$: Subject<any> = new Subject<any>();
  startingLayout = {};
  plotLayout = {};
  plotStartDate: Date;
  plotEndDate: Date;

  currencyAndUnit: string;
  dataX: string[];
  dataY: number[];

  contractType = ContractType;
  secondaryIndex: TradeIndexCorrelationPairExtended;
  secondaryCurrencyAndUnit: string;
  secondaryDataX: string[];
  secondaryDataY: number[];

  rangeSliderPlotData: PlotlyData[];
  rangeSliderRefreshLayout$: Subject<any> = new Subject<any>();
  rangeSliderStartingLayout: any;
  rangeSliderLayout: any;

  rollingDealContractConfigForm: FormGroup<RollingDealContractConfigForm>;

  additionalOptionsForm: FormGroup<AdditionalOptionsForm> = this.fb.nonNullable.group({
    ...AdditionalOptionsFormGroup,
  });

  rangeForm: FormGroup = this.fb.group({
    dateRange: [0],
  });
  graphRangeOptions: Option[];

  private rollingDealConfig: RollingDealConfigurationData;
  private unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly tradingCenterService: TradingCenterService,
    private readonly toastService: ToastService,
    private readonly sidebarStatusService: SidebarStatusService,
    private readonly rollingDealConfigurationService: RollingDealConfigurationService
  ) {}

  ngOnInit(): void {
    // When there's no rolling deal configuration set, we are using the default value
    this.rollingDealConfig =
      this.indexDetails.rolling_deal_config ||
      this.rollingDealConfigurationService.getDefaultRollingDealConfiguration();

    this.rollingDealContractConfigForm = this.fb.nonNullable.group(
      {
        popularStructures: [null],
        direction: [OptionTypes.Call, Validators.required],
        duration: [
          1,
          [Validators.required, Validators.min(1), Validators.max(this.rollingDealConfig.maximum_duration)],
        ],
        strikeAndLimitRatio: [
          [
            this.rollingDealConfig.minimum_call_strike_ratio,
            this.rollingDealConfig.minimum_call_strike_ratio + this.rollingDealConfig.maximum_spread_ratio,
          ],
          Validators.required,
        ],
        startingDelay: [
          1,
          [Validators.required, Validators.min(1), Validators.max(this.rollingDealConfig.maximum_delay)],
        ],
        sellingMonths: [null, Validators.required],
        quantity: [null, [Validators.required, Validators.pattern('^[0-9]*$')]],
      },
      {
        validators: [this.checkStrikeAndLimitRatio(), this.checkFixation(), this.checkQuantity()],
      }
    );

    this.dataX = this.indexPrices.map((item) => item.stable_assigned_date);
    this.dataY = this.indexPrices.map((item) => item.price);
    this.currencyAndUnit = getCurrencyAndUnit(this.indexDetails, true);
    this.startingLayout = {
      yaxis: { fixedrange: true, title: { text: this.currencyAndUnit } },
      yaxis2: { fixedrange: true },
      xaxis: { fixedrange: true },
      margin: { t: 10, r: 5 },
      legend: { y: -0.31 },
    };

    // Get range of options for user to select
    const today = new Date();
    this.plotStartDate = new Date(today.getFullYear() - 2, today.getMonth(), 1);
    this.plotEndDate = new Date(today.getFullYear(), today.getMonth(), 0);
    const currentYear = today.getFullYear();
    const indexYearsLength = Math.max(
      Math.floor(monthsDelta(this.dataX[0] || new Date(), new Date(today.getFullYear(), today.getMonth(), 0)) / 12),
      2
    );
    this.graphRangeOptions = [...Array(indexYearsLength - 1).keys()].map((i) => {
      return {
        label: `${currentYear - i - 2} - ${currentYear - i}`,
        id: i,
      };
    });
    this.rangeForm.get('dateRange')?.valueChanges.subscribe((value) => {
      this.plotStartDate = new Date(today.getFullYear() - 2 - value, today.getMonth(), 1);
      this.plotEndDate = new Date(today.getFullYear() - value, today.getMonth(), 0);
      this.loadPlot();
      this.loadRangeSlider();
    });

    // Refresh layout on sidebar toggle
    this.sidebarStatusService.isOpen$.pipe(takeUntil(this.unsubscribeAll)).subscribe(() =>
      setTimeout(() => {
        this.refreshLayout$.next(this.plotLayout);
        this.rangeSliderRefreshLayout$.next(this.rangeSliderLayout);
      }, 500)
    );

    // Reload plot after any additional options change
    this.additionalOptionsForm.valueChanges.pipe(takeUntil(this.unsubscribeAll)).subscribe(() => this.loadPlot());

    // Refresh plot after any contract config change
    this.rollingDealContractConfigForm.valueChanges
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(() => this.loadPlot());

    this.rangeSliderStartingLayout = {
      yaxis: { fixedrange: true, visible: false },
      yaxis2: { fixedrange: true, visible: false },
      xaxis: { fixedrange: true, range: [this.dataX[0], this.dataX[this.dataX.length - 1]] },
      margin: { t: 0, r: 5, b: 0 },
    };

    this.loadPlot();
    this.loadRangeSlider();
  }

  onSelectCorrelation(correlatedIndex: TradeIndexCorrelationPairExtended) {
    this.secondaryIndex = correlatedIndex;
    this.secondaryCurrencyAndUnit = getCurrencyAndUnit(this.secondaryIndex.correlated_index, true);
    this.getSecondaryIndexPrices(correlatedIndex.correlated_index.id).then();
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
      this.loadRangeSlider();
    } catch (e) {
      this.toastService.error('Failed to load secondary index.');
    } finally {
    }
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

    const contractY: number[] = [];
    const form = this.rollingDealContractConfigForm;
    const sellingMonths = form.get('sellingMonths')?.value;
    const startingDelay = form.get('startingDelay')?.value;
    const duration = form.get('duration')?.value;
    const direction = form.get('direction')?.value;
    const strikeAndLimit = form.get('strikeAndLimitRatio')?.value;
    const [strike, limit] =
      direction === OptionTypes.Call
        ? [strikeAndLimit[0] / 100, strikeAndLimit[1] / 100]
        : [strikeAndLimit[1] / 100, strikeAndLimit[0] / 100];
    if (sellingMonths) {
      this.plotLayout = _.merge(this.plotLayout, {
        shapes: sellingMonths
          .map((sellingMonth: number) => {
            const startDate = addTimezone(addMonths(this.plotStartDate, sellingMonth));
            const priceBeforeDate = this.dataY.filter((e, i) => {
              return e && new Date(this.dataX[i]) <= startDate;
            });
            const latestPrice = priceBeforeDate[priceBeforeDate.length - 1];
            const delayDate = addTimezone(addMonths(this.plotStartDate, sellingMonth + startingDelay));
            let endDate = addTimezone(addMonths(this.plotStartDate, sellingMonth + startingDelay + duration));
            endDate = new Date(endDate.getFullYear(), endDate.getMonth(), 0);
            const strikeLevel = strike * latestPrice;
            contractY.push(strikeLevel);
            const limitLevel = limit * latestPrice;
            contractY.push(limitLevel);
            return [
              {
                type: 'line',
                x0: startDate,
                x1: startDate,
                y0: latestPrice,
                y1: strikeLevel,
                line: {
                  color: 'grey',
                  width: 1,
                  dash: 'dot',
                },
              },
              {
                type: 'line',
                x0: startDate,
                x1: delayDate,
                y0: strikeLevel,
                y1: strikeLevel,
                line: {
                  color: 'grey',
                  width: 1,
                  dash: 'dot',
                },
              },
              {
                type: 'rect',
                x0: delayDate,
                x1: endDate,
                y0: strikeLevel,
                y1: limitLevel,
                line: {
                  width: 0,
                },
                fillcolor: PlotlyTraceColors.TransparentPrimary,
              },
            ];
          })
          .flat(),
      });
    }

    const dataYInRange = this.dataY.filter((e, i) => {
      const date = new Date(this.dataX[i]);
      return e && date >= this.plotStartDate && date <= this.plotEndDate;
    });
    const yMin = Math.min(...dataYInRange, ...contractY);
    const yMax = Math.max(...dataYInRange, ...contractY);
    const yRange = yMax - yMin;

    this.plotLayout = _.merge(this.plotLayout, {
      xaxis: { range: [this.plotStartDate, this.plotEndDate] },
      yaxis: { range: [yMin - 0.2 * yRange, yMax + 0.25 * yRange] },
    });

    if (this.secondaryIndex && this.secondaryDataX.length) {
      const secondaryDataYInRange = this.secondaryDataY.filter((e, i) => {
        const date = new Date(this.secondaryDataX[i]);
        return e && date >= this.plotStartDate && date <= this.plotEndDate;
      });
      const secondaryYMin = Math.min(...secondaryDataYInRange);
      const secondaryYMax = Math.max(...secondaryDataYInRange);
      const secondaryYRange = secondaryYMax - secondaryYMin;

      this.plotLayout = _.merge(this.plotLayout, {
        margin: { r: 60 },
        yaxis2: {
          visible: true,
          title: {
            text: this.secondaryCurrencyAndUnit,
          },
          range: [secondaryYMin - 0.2 * secondaryYRange, secondaryYMax + 0.25 * secondaryYRange],
        },
      });
    }

    this.refreshLayout$.next(this.plotLayout);
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

  private loadRangeSlider() {
    this.rangeSliderPlotData = [
      {
        x: this.dataX,
        y: this.dataY,
        type: PlotlyGraphTypes.Scatter,
        mode: PlotlyModeTypes.LinesAndMarkers,
        name: this.indexDetails?.stable_index_code,
        hoverinfo: PlotlyHoverInfoTypes.Skip,
        fill: PlotlyFillTypes.ToZeroY,
        fillcolor: PlotlyTraceColors.Transparent,
        line: { color: PlotlyTraceColors.Primary100, width: 2 },
        marker: { color: PlotlyTraceColors.Primary100, size: 2 },
      },
    ];

    this.rangeSliderLayout = _.merge(this.rangeSliderStartingLayout, {
      shapes: [
        {
          type: 'rect',
          x0: this.plotEndDate,
          x1: this.dataX[this.dataX.length - 1],
          y0: 0,
          y1: 1,
          yref: 'paper',
          line: {
            width: 0,
          },
          fillcolor: PlotlyTraceColors.TransparentGray,
        },
        {
          type: 'rect',
          x0: this.dataX[0],
          x1: this.plotStartDate,
          y0: 0,
          y1: 1,
          yref: 'paper',
          line: {
            width: 0,
          },
          fillcolor: PlotlyTraceColors.TransparentGray,
        },
      ],
    });

    if (this.secondaryIndex && this.secondaryDataX.length) {
      this.rangeSliderPlotData = [
        ...this.rangeSliderPlotData,
        {
          x: this.secondaryDataX,
          y: this.secondaryDataY,
          yaxis: PlotlyAxisTypes.Y2,
          type: PlotlyGraphTypes.Scatter,
          mode: PlotlyModeTypes.LinesAndMarkers,
          name: this.secondaryIndex.stable_index_code,
          hoverinfo: PlotlyHoverInfoTypes.Skip,
          fill: PlotlyFillTypes.ToZeroY,
          fillcolor: PlotlyTraceColors.Transparent,
          line: { color: PlotlyTraceColors.Accent100, width: 2 },
          marker: { color: PlotlyTraceColors.Accent100, size: 2 },
        },
      ];

      this.rangeSliderLayout = _.merge(this.rangeSliderStartingLayout, {
        margin: { r: 60 },
      });
    }

    this.rangeSliderRefreshLayout$.next(this.rangeSliderLayout);
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }

  private checkStrikeAndLimitRatio(): ValidatorFn {
    const { minimum_call_strike_ratio, maximum_put_strike_ratio, minimum_spread_ratio, maximum_spread_ratio } =
      this.rollingDealConfig;
    return function (control: AbstractControl): ValidationErrors | null {
      const directionControl = control.get('directionControl');
      const strikeAndLimitRatioControl = control.get('strikeAndLimitRatio');

      if (directionControl?.pristine || strikeAndLimitRatioControl?.pristine) {
        return null;
      }

      const direction = directionControl?.value;
      const strikeAndLimitRatio = strikeAndLimitRatioControl?.value;

      const error = {} as any;

      if (direction === OptionTypes.Call) {
        const [strike, limit] = strikeAndLimitRatio;
        if (strike < minimum_call_strike_ratio) {
          error.invalidStrike = true;
          return error;
        }
        if (
          limit < minimum_call_strike_ratio + minimum_spread_ratio ||
          limit > minimum_call_strike_ratio + maximum_spread_ratio
        ) {
          error.invalidLimit = true;
          return error;
        }
        if (strike > limit) {
          error.invalidDirection = true;
          return error;
        }
        return null;
      } else if (direction === OptionTypes.Put) {
        const [limit, strike] = strikeAndLimitRatio;
        if (strike > maximum_put_strike_ratio) {
          error.invalidStrike = true;
          return error;
        }
        if (
          limit < maximum_put_strike_ratio - maximum_spread_ratio ||
          limit > maximum_put_strike_ratio + minimum_spread_ratio
        ) {
          error.invalidLimit = true;
          return error;
        }
        if (limit > strike) {
          error.invalidDirection = true;
          return error;
        }
        return null;
      }
      return null;
    };
  }

  private checkFixation(): ValidatorFn {
    const { minimum_fixations, maximum_contract_length, minimum_coverage_length, last_available_expiration_length } =
      this.rollingDealConfig;
    return function (control: AbstractControl): ValidationErrors | null {
      const sellingMonthsControl = control.get('sellingMonths');
      const startingDelayControl = control.get('startingDelay');
      const durationControl = control.get('duration');

      if (sellingMonthsControl?.pristine) {
        return null;
      }

      const sellingMonths = sellingMonthsControl?.value;
      const startingDelay = startingDelayControl?.value;
      const duration = durationControl?.value;

      if (sellingMonths.length < minimum_fixations) {
        return { moreFixations: true, min: minimum_fixations };
      }

      const last = Math.max(...sellingMonths);
      const first = Math.min(...sellingMonths);
      const max = last_available_expiration_length - startingDelay - duration;

      if (last > max) {
        return {
          invalidFixation: true,
          error:
            'The last fixation date a user could select is current month + Last Available Expiration Date - Starting Delay - Duration',
        };
      }

      if (last - first + duration < minimum_coverage_length) {
        return {
          invalidFixation: true,
          error: `Coverage must be between ${minimum_coverage_length} and ${maximum_contract_length} months.`,
        };
      }

      if (last - first + duration > maximum_contract_length) {
        return {
          invalidFixation: true,
          error: `Coverage must be between ${minimum_coverage_length} and ${maximum_contract_length} months.`,
        };
      }

      return null;
    };
  }

  private checkQuantity(): ValidatorFn {
    const { minimum_volume, maximum_volume, minimum_risk_capital_per_deal, maximum_risk_capital_per_deal } =
      this.rollingDealConfig;
    let lastIndexPrice = this.indexDetails.last_index_price;
    lastIndexPrice = this.indexDetails.is_currency_cents ? lastIndexPrice * 0.01 : lastIndexPrice;

    return function (control: AbstractControl): ValidationErrors | null {
      const quantityControl = control.get('quantity');
      const strikeAndLimitRatioControl = control.get('strikeAndLimitRatio');
      const directionControl = control.get('directionControl');

      if (quantityControl?.pristine) {
        return null;
      }

      const direction = directionControl?.value;
      const strikeAndLimit = strikeAndLimitRatioControl?.value;
      let [strike, limit] = direction == OptionTypes.Call ? strikeAndLimit : [strikeAndLimit[1], strikeAndLimit[0]];

      const quantity = quantityControl?.value;

      const lowerLimit = Math.max(
        minimum_volume,
        Math.round((minimum_risk_capital_per_deal / Math.abs(strike - limit) / lastIndexPrice) * 100)
      );

      // When maximum_risk_capital_per_deal is 0, then use infinity for the upper limit. Quantity + 1 is always
      const upperLimit = Math.min(
        maximum_volume || Infinity,
        Math.round((maximum_risk_capital_per_deal / Math.abs(strike - limit) / lastIndexPrice) * 100)
      );

      if (quantity < lowerLimit || quantity > upperLimit) {
        return { invalidQuantity: true, lower: lowerLimit, upper: upperLimit };
      }

      return null;
    };
  }
}
