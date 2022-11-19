import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { filter, firstValueFrom, map, Subject } from 'rxjs';
import { PlotRelayoutEvent } from 'plotly.js';
import * as _ from 'lodash';

import { AdditionalOptions } from '../../../../core/strict-typed-forms/index-details-additional-options.form';
import { StoreService } from '../../../../core/services/store.service';
import { parseIndexPrices, windowPeriodFromFrequency } from '../../../../ui-kit/graph-kit/plotly-chart.utils';
import {
  PlotlyAxisTypes,
  PlotlyFillTypes,
  PlotlyGraphTypes,
  PlotlyHistNormTypes,
  PlotlyHoverInfoTypes,
  PlotlyLineDashTypes,
  PlotlyModeTypes,
  PlotlyTraceColors,
} from '../../../../ui-kit/graph-kit/plotly-chart.options';
import { IndexDetailsStoreService } from '../../index-details-store.service';
import { LoadingSpinner } from '../../../../ui-kit/spinner/spinner';
import { IndexLibraryService } from '../../../../core/services/index-library.service';
import { PlotlyData } from '../../../../ui-kit/graph-kit/plotly-chart.models';
import { ToastService } from '../../../../ui-kit/toast/toast.service';
import { linearRegression } from '../../../../core/utils/linear-regression.util';
import { movingAverage } from '../../../../core/utils/moving-average.util';
import { IndexFlattened } from '../../../../core/models/index.model';
import { IndexService } from '../../../../core/services/index.service';
import { getCurrencyAndUnit, parseIndexDetails } from '../../../../core/utils/index-detail.util';
import { removeTimezone } from '../../../../core/utils/dates.util';
import { downloadXLS, XLSContentDataType } from '../../../../core/utils/download-xls.util';
import { getDecimal } from '../../../../core/utils/number.util';

@Component({
  selector: 'dd-general-information-tab',
  templateUrl: './general-information-tab.component.html',
  styleUrls: ['./general-information-tab.component.scss'],
})
export class GeneralInformationTabComponent implements OnInit, OnDestroy {
  @Input() fullscreen = false;

  spinner: LoadingSpinner<{ loading: boolean }>;
  data: PlotlyData[] = [];
  hasExtension: boolean = false;
  refreshLayout$ = new Subject<any>();
  filterLayoutChanges: any = {};

  startDate: number | null;
  startPrice: number | null;
  endDate: number | null;
  endPrice: number | null;

  selectedStartDate: string | null;
  selectedEndDate: string | null;

  private currentSecondaryIndex: string; // To store the currently selected secondary index id
  private secondaryIndexDetails: IndexFlattened;
  private extensionIndexPrices: PlotlyData = {};
  private nonExtensionIndexPrices: PlotlyData = {};
  private nonExtensionSecondaryIndexPrices: PlotlyData = {};
  private indexSeasonalityFitted: PlotlyData = {};
  private indexSeasonalityForecast: PlotlyData = {};
  private sarimaForecast: PlotlyData = {};
  private sarimaForecastCI: PlotlyData = {};
  private historicalEWMAVol: PlotlyData = {};
  private histogramPdf: PlotlyData = {};

  constructor(
    private store: StoreService,
    public indexDetailsStoreService: IndexDetailsStoreService,
    private indexLibraryService: IndexLibraryService,
    private toast: ToastService,
    private indexService: IndexService
  ) {}

  async ngOnInit() {
    this.spinner = new LoadingSpinner({
      loading: 'Loading index chart...',
    });
    this.spinner.loaders.loading.show();
    // Wait until all primary data loading is finished...
    await firstValueFrom(this.indexDetailsStoreService.spinner.isLoading$.pipe(filter((isLoading) => !isLoading)));
    this.initGraph();
    this.spinner.loaders.loading.hide();
    this.refreshLayout$.next(this.refreshFilters(false));
    this.getPriceChangeHeader();
  }

  ngOnDestroy() {
    this.spinner.destroy();
  }

  async filterChange(option: AdditionalOptions) {
    this.filterLayoutChanges = {};
    this.spinner.loaders.loading.show();
    this.data = [this.nonExtensionIndexPrices];
    this.filterLayoutChanges = _.merge(this.filterLayoutChanges, this.refreshFilters(false));
    if (option.secondary_index) {
      if (option.secondary_index !== this.currentSecondaryIndex) {
        // Storing the old value, because even secondary index is not changed, this function will be called...
        this.currentSecondaryIndex = option.secondary_index;
        await this.loadSecondaryIndexPrice(option.secondary_index).then();
      } else {
        this.data = [...this.data, this.nonExtensionSecondaryIndexPrices];
      }
      this.filterLayoutChanges = _.merge(
        this.filterLayoutChanges,
        this.refreshFilters(true, getCurrencyAndUnit(this.secondaryIndexDetails))
      );
    } else {
      // Dummy data necessary to clear range slider - plotly's bug
      const dummyData: PlotlyData = {
        x: [],
        y: [],
        visible: false,
        mode: PlotlyModeTypes.Lines,
        yaxis: PlotlyAxisTypes.Y2,
      };
      this.data = [...this.data, dummyData];
    }

    if (option.extension) {
      this.data = [...this.data, this.extensionIndexPrices];
    }

    if (option.historical_pdf) {
      this.data = [...this.data, this.histogramPdf];
    }

    if (option.trend) {
      this.data = [...this.data, this.calcIndexTrends()];
    }

    if (option['12m_ma']) {
      this.data = [...this.data, this.calcMovingAverage(12, '12M MA')];
    }

    if (option['24m_ma']) {
      this.data = [...this.data, this.calcMovingAverage(24, '24M MA')];
    }

    if (option.sarima) {
      await this.loadSarimaForecast();
    }

    if (option.seasonality) {
      await this.loadSeasonalityForecast();
    }

    if (option.historical_vol) {
      await this.loadHistoricalEWMAVol();
      this.filterLayoutChanges = _.merge(this.filterLayoutChanges, this.refreshFilters(true));
    }

    if (option.horizontal_lines) {
      this.data = [...this.data, ...this.calcHorizontalLines(option.horizontal_lines)];
    }

    this.spinner.loaders.loading.hide();
    this.refreshLayout$.next(this.filterLayoutChanges);
    this.getPriceChangeHeader();
  }

  downloadData() {
    downloadXLS(
      `IndexPrices__${this.indexDetailsStoreService.indexDetails?.stable_index_code}`,
      this.data
        .filter((data) => data.name && data.x)
        .map((data) => ({
          name: data.name || '',
          type: XLSContentDataType.Array,
          content: [['Dates', data.name], ...data.x!.map((e, i) => [removeTimezone(e), data.y![i]])],
        }))
    );
  }

  refreshFilters(secondaryAxis: boolean, axisTitle?: string) {
    return {
      xaxis: { title: { text: 'Dates' } },
      xaxis2: {
        visible: false,
        rangeslider: null,
      },
      yaxis: {
        fixedrange: false,
        title: {
          text: this.indexDetailsStoreService.indexCurrencyAndUnit,
        },
      },
      yaxis2: {
        fixedrange: false,
        visible: secondaryAxis,
        title: {
          text: axisTitle,
        },
      },
      margin: {
        r: secondaryAxis ? 60 : 5,
      },
    };
  }

  private initGraph() {
    const indexDetails = this.indexDetailsStoreService.indexDetails;
    const { x, y, hoverTemplate, extensionX, extensionY } = parseIndexPrices(this.indexDetailsStoreService.indexPrices);

    this.nonExtensionIndexPrices = {
      x,
      y,
      hovertemplate: hoverTemplate,
      type: PlotlyGraphTypes.Scatter,
      mode: PlotlyModeTypes.LinesAndMarkers,
      name: indexDetails?.stable_index_code,
      fill: PlotlyFillTypes.ToZeroY,
      fillcolor: PlotlyTraceColors.Transparent,
      line: { color: PlotlyTraceColors.Primary100, width: 2 },
      marker: { color: PlotlyTraceColors.Primary100, size: 2 },
    };

    if (extensionX.length > 0) {
      this.extensionIndexPrices = {
        x: extensionX,
        y: extensionY,
        type: PlotlyGraphTypes.Scatter,
        mode: PlotlyModeTypes.LinesAndMarkers,
        name: 'Extension',
        fill: PlotlyFillTypes.ToZeroY,
        fillcolor: PlotlyTraceColors.Transparent,
        line: { color: PlotlyTraceColors.Primary200, width: 2 },
        marker: { color: PlotlyTraceColors.Primary200, size: 2 },
      };
      this.hasExtension = true;
    }

    this.histogramPdf = {
      y: y,
      nbinsx: Math.min(100, Math.floor(y.length / 3)),
      type: PlotlyGraphTypes.Histogram,
      name: 'PDF Histogram',
      histnorm: PlotlyHistNormTypes.ProbabilityDensity,
      marker: { color: PlotlyTraceColors.TransparentPrimary },
      xaxis: PlotlyAxisTypes.X2,
    };
    this.data = [this.nonExtensionIndexPrices];
  }

  private async loadSecondaryIndexPrice(secondaryIndexId: string) {
    try {
      const name = this.store.indexUUIDs.find((item) => item.id === secondaryIndexId)?.stable_index_code;

      const results = await firstValueFrom(this.indexLibraryService.getIndexPrices(secondaryIndexId));
      this.secondaryIndexDetails = await firstValueFrom(
        this.indexService.getIndex(secondaryIndexId).pipe(map((item) => parseIndexDetails(item)))
      );
      const { x, y, hoverTemplate } = parseIndexPrices(results);

      this.nonExtensionSecondaryIndexPrices = {
        x,
        y,
        name,
        hovertemplate: hoverTemplate,
        type: PlotlyGraphTypes.Scatter,
        mode: PlotlyModeTypes.LinesAndMarkers,
        fill: PlotlyFillTypes.ToZeroY,
        fillcolor: PlotlyTraceColors.Transparent,
        line: { color: PlotlyTraceColors.Accent100, width: 2 },
        marker: { color: PlotlyTraceColors.Accent100, size: 2 },
        yaxis: PlotlyAxisTypes.Y2,
      };
      this.data = [...this.data, this.nonExtensionSecondaryIndexPrices];
    } catch (e) {
      this.toast.error('Failed to load secondary index price chart.');
    } finally {
    }
  }

  private calcHorizontalLines(lineInput: string): PlotlyData[] {
    return lineInput
      .split(',')
      .map((line) => line.trim())
      .filter((line) => !isNaN(Number(line)))
      .map((line) => {
        const allX: any[] = [];
        this.data.map((oneLine) => {
          if (oneLine.x) {
            allX.push(...oneLine.x!);
          }
        });
        return {
          x: allX,
          y: Array(allX.length).fill(Number(line)),
          type: PlotlyGraphTypes.Scatter,
          mode: PlotlyModeTypes.Lines,
          name: `Line ${line}`,
          line: { width: 1, dash: PlotlyLineDashTypes.Dash, color: PlotlyTraceColors.Gray },
          hoverinfo: PlotlyHoverInfoTypes.Skip,
        };
      });
  }

  private calcIndexTrends() {
    const { sl, off } = linearRegression(
      [...Array(this.nonExtensionIndexPrices.y!.length).keys()], // Array of 1, 2, ..., y.length
      this.nonExtensionIndexPrices.y!
    );
    this.filterLayoutChanges = _.merge(this.filterLayoutChanges, {
      annotations: [
        {
          x: 0.98,
          y: 0.02,
          xanchor: 'right',
          yanchor: 'bottom',
          xref: 'paper',
          yref: 'paper',
          showarrow: false,
          text: `Trend: Y = ${getDecimal(sl, 4)}X ${off >= 0 ? '+' : '-'} ${getDecimal(Math.abs(off), 4)}`,
        },
      ],
    });
    return {
      x: this.nonExtensionIndexPrices.x,
      y: [...Array(this.nonExtensionIndexPrices.y!.length).keys()].map((el) => off + el * sl),
      type: PlotlyGraphTypes.Scatter,
      mode: PlotlyModeTypes.Lines,
      name: 'Trend',
      line: { width: 1, dash: PlotlyLineDashTypes.Dot, color: PlotlyTraceColors.MidnightBlue },
    };
  }

  private calcMovingAverage(months: number, name: string) {
    const windowPeriod = windowPeriodFromFrequency(this.indexDetailsStoreService.indexDetails.price_frequency, months);
    const movingAverageY = movingAverage(this.nonExtensionIndexPrices.y!, windowPeriod);
    return {
      name,
      x: this.nonExtensionIndexPrices.x,
      y: movingAverageY,
      type: PlotlyGraphTypes.Scatter,
      mode: PlotlyModeTypes.Lines,
      line: { width: 1, dash: PlotlyLineDashTypes.Dot, color: PlotlyTraceColors.MidnightBlue },
    };
  }

  private async loadHistoricalEWMAVol() {
    try {
      if (!this.historicalEWMAVol.x) {
        const results = await firstValueFrom(
          this.indexLibraryService.getHistoricalEWMAVol(this.indexDetailsStoreService.indexDetails.id)
        );

        this.historicalEWMAVol = {
          x: results.map((item) => item.stable_assigned_date),
          y: results.map((item) => item.vol),
          type: PlotlyGraphTypes.Scatter,
          mode: PlotlyModeTypes.Lines,
          name: 'Volatility',
          line: { color: PlotlyTraceColors.Gold, width: 1 },
          yaxis: PlotlyAxisTypes.Y2,
        };
      }
      this.data = [...this.data, this.historicalEWMAVol];
    } catch (e) {
      this.toast.error('Failed to load historical volatility.');
    } finally {
    }
  }

  private async loadSeasonalityForecast() {
    try {
      if (!this.indexSeasonalityFitted.x) {
        const results = await firstValueFrom(
          this.indexLibraryService.getIndexSeasonalityForecasts(this.indexDetailsStoreService.indexDetails.id)
        );

        this.indexSeasonalityFitted = {
          x: results.map((item) => item.stable_assigned_date),
          y: results.map((item) => item.fitted_pattern),
          type: PlotlyGraphTypes.Scatter,
          mode: PlotlyModeTypes.Lines,
          name: 'Fitted Seasonality',
          line: { color: PlotlyTraceColors.Accent200, width: 2 },
        };

        this.indexSeasonalityForecast = {
          x: results.map((item) => item.stable_assigned_date),
          y: results.map((item) => item.forecasted_price),
          type: PlotlyGraphTypes.Scatter,
          mode: PlotlyModeTypes.Lines,
          name: 'Seasonality Forecast',
          line: { color: PlotlyTraceColors.Accent100, width: 2 },
        };
      }
      this.data = [...this.data, this.indexSeasonalityFitted, this.indexSeasonalityForecast];
    } catch (e) {
      this.toast.error('Failed to load seasonality data.');
    } finally {
    }
  }

  private async loadSarimaForecast() {
    try {
      if (!this.sarimaForecast.x) {
        const results = await firstValueFrom(
          this.indexLibraryService.getSarimaForecasts(this.indexDetailsStoreService.indexDetails.id)
        );

        // Add last value from index prices in to 'join' the CI with index price line
        this.sarimaForecast = {
          x: [
            this.nonExtensionIndexPrices.x![this.nonExtensionIndexPrices.x!.length - 1],
            ...results.map((item) => item.stable_assigned_date),
          ],
          y: [
            this.nonExtensionIndexPrices.y![this.nonExtensionIndexPrices.y!.length - 1],
            ...results.map((item) => item.predicted_mean),
          ],
          type: PlotlyGraphTypes.Scatter,
          mode: PlotlyModeTypes.Lines,
          name: 'Sarima Forecast',
          line: { color: PlotlyTraceColors.Black, width: 2 },
        };

        const sarimaForecastCiX = results.map((item) => item.stable_assigned_date);
        const sarimaForecastCiYLow = results.map((item) => item.lower_price);
        const sarimaForecastCiYHigh = results.map((item) => item.upper_price);

        this.sarimaForecastCI = {
          x: [
            this.nonExtensionIndexPrices.x![this.nonExtensionIndexPrices.x!.length - 1],
            ...sarimaForecastCiX,
            ...[...sarimaForecastCiX].reverse(),
          ],
          y: [
            this.nonExtensionIndexPrices.y![this.nonExtensionIndexPrices.y!.length - 1],
            ...sarimaForecastCiYLow,
            ...sarimaForecastCiYHigh.reverse(),
          ],
          type: PlotlyGraphTypes.Scatter,
          mode: PlotlyModeTypes.Lines,
          fill: PlotlyFillTypes.ToSelf,
          fillcolor: PlotlyTraceColors.TransparentGray,
          name: 'Sarima CI',
          hoverinfo: PlotlyHoverInfoTypes.Skip,
          line: { color: PlotlyTraceColors.Transparent, width: 2 },
        };
      }
      this.data = [...this.data, this.sarimaForecast, this.sarimaForecastCI];
    } catch (e) {
      this.toast.error('Failed to load sarima forecast.');
    } finally {
    }
  }

  graphRelayout(event: PlotRelayoutEvent) {
    if (event['xaxis.autorange']) {
      this.selectedStartDate = null;
      this.selectedEndDate = null;
    } else if (event['xaxis.range']) {
      this.selectedStartDate = event['xaxis.range'][0]!.toString();
      this.selectedEndDate = event['xaxis.range'][1]!.toString();
    } else if (event['xaxis.range[0]'] && event['xaxis.range[1]']) {
      this.selectedStartDate = event['xaxis.range[0]'].toString();
      this.selectedEndDate = event['xaxis.range[1]'].toString();
    }
    this.getPriceChangeHeader();
  }

  getPriceChangeHeader() {
    if (this.nonExtensionIndexPrices?.x && this.nonExtensionIndexPrices?.y) {
      if (!this.selectedStartDate || !this.selectedEndDate) {
        this.startDate = this.nonExtensionIndexPrices.x[0];
        this.endDate = this.nonExtensionIndexPrices.x[this.nonExtensionIndexPrices.x.length - 1];
        this.startPrice = this.nonExtensionIndexPrices.y[0];
        this.endPrice = this.nonExtensionIndexPrices.y[this.nonExtensionIndexPrices.y.length - 1];
      } else {
        const filteredX = this.nonExtensionIndexPrices.x.filter(
          (date, index) =>
            date >= this.selectedStartDate! && date <= this.selectedEndDate! && this.nonExtensionIndexPrices.y?.[index]
        );
        if (filteredX) {
          this.startDate = filteredX[0];
          this.endDate = filteredX[filteredX.length - 1];
        }

        const filteredY: number[] = this.nonExtensionIndexPrices.y.filter(
          (price, index) =>
            this.nonExtensionIndexPrices.x?.[index] >= this.selectedStartDate! &&
            this.nonExtensionIndexPrices.x?.[index] <= this.selectedEndDate! &&
            price
        );
        if (filteredY) {
          this.startPrice = filteredY[0];
          this.endPrice = filteredY[filteredY.length - 1];
        }
      }
    } else {
      this.startDate = null;
      this.endDate = null;
      this.startPrice = null;
      this.endPrice = null;
    }
  }
}
