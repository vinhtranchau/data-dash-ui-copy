import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject, filter, firstValueFrom, Subject } from 'rxjs';

import { YearlySeasonality } from '../../../../core/models/index-statistics.model';
import { IndexDetailsStoreService } from '../../index-details-store.service';
import { LoadingSpinner } from '../../../../ui-kit/spinner/spinner';
import { PlotlyData } from '../../../../ui-kit/graph-kit/plotly-chart.models';
import { ToastService } from '../../../../ui-kit/toast/toast.service';

import { monthsOrder } from '../../../../core/models/dates.model';
import { parseIndexPrices } from '../../../../ui-kit/graph-kit/plotly-chart.utils';
import {
  colorArray,
  PlotlyAxisTypes,
  PlotlyFillTypes,
  PlotlyGraphTypes,
  PlotlyHoverInfoTypes,
  PlotlyModeTypes,
  PlotlyTraceColors,
} from '../../../../ui-kit/graph-kit/plotly-chart.options';
import { YearOptionsForm, yearOptionsFormGroup } from '../../../../core/strict-typed-forms/yearly-seasonality.form';

@Component({
  selector: 'dd-seasonality-tab',
  templateUrl: './seasonality-tab.component.html',
  styleUrls: ['./seasonality-tab.component.scss'],
})
export class SeasonalityTabComponent implements OnInit, OnDestroy {
  @Input() fullscreen = false;

  seasonalStatistics = this.indexDetailsStoreService.seasonalStatistics;
  seasonalStatistics$ = this.indexDetailsStoreService.seasonalStatistics$.asObservable();
  seasonalData: PlotlyData[] = [];
  refreshSeasonalLayout$ = new Subject<any>();

  yearlySeasonalData: PlotlyData[] = [];
  refreshYearlySeasonalLayout$ = new Subject<any>();

  monthlyStatsColumns = ['Statistic', ...monthsOrder];
  priceChangeRatioColumns = ['Maturity', ...monthsOrder];

  spinner: LoadingSpinner<{ seasonalStatistics: boolean }>;
  form: FormGroup<YearOptionsForm> = this.fb.nonNullable.group({ ...yearOptionsFormGroup });
  possibleYearOptions: Record<any, any>[] = [];

  priceChangeRatioOptions = Array.from(Array(24).keys()).map((number) => ({
    label: number + 1,
    id: number + 1,
  }));

  pcrMeanMaturities = [2, 4, 6, 8, 10, 12, 24];
  pcrStdMaturities = [2, 4, 6, 8, 10, 12, 24];

  displayMeanRows$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([2, 4, 6, 8, 10, 12, 24]);
  displayStdRows$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([2, 4, 6, 8, 10, 12, 24]);

  constructor(
    public indexDetailsStoreService: IndexDetailsStoreService,
    private toast: ToastService,
    private fb: FormBuilder
  ) {
  }

  async ngOnInit() {
    try {
      this.spinner = new LoadingSpinner({
        seasonalStatistics: 'Loading seasonality charts...',
      });
      this.spinner.loaders.seasonalStatistics.show();
      // Wait until primary data loaded - indexDetails, indexPrices
      await firstValueFrom(this.indexDetailsStoreService.spinner.isLoading$.pipe(filter((isLoading) => !isLoading)));
      await this.indexDetailsStoreService.loadSeasonalStatistics();
      await this.indexDetailsStoreService.loadYearlySeasonality();
      this.loadSeasonalPlots();
      this.loadYearlySeasonalData(this.form.value);
      this.form.valueChanges.subscribe((form) => this.loadYearlySeasonalData(form));
    } catch (e) {
      this.toast.error('Failed to load seasonal graphs');
    } finally {
      this.spinner.loaders.seasonalStatistics.hide();
    }
  }

  ngOnDestroy(): void {
    this.spinner.destroy();
  }

  private loadSeasonalPlots() {
    const { x, y } = parseIndexPrices(this.indexDetailsStoreService.indexPrices);

    this.seasonalData = [
      {
        // Box Plot
        x: [...monthsOrder, ...x.map((date) => monthsOrder[new Date(date).getMonth()])],
        y: [...Array.from({ length: 12 }, (e, i) => null), ...y],
        type: PlotlyGraphTypes.Box,
        name: this.indexDetailsStoreService.indexDetails.stable_index_code,
        marker: { color: PlotlyTraceColors.Primary100, size: 2 },
      },
    ];
    this.refreshSeasonalLayout$.next({
      xaxis: { title: { text: 'Months' } },
      yaxis: {
        title: {
          text: this.indexDetailsStoreService.indexCurrencyAndUnit,
        },
      },
    });
    this.possibleYearOptions = this.indexDetailsStoreService.yearlySeasonality!.map((yearData: YearlySeasonality) => ({
      id: yearData.Year,
      label: yearData.Year.toString(),
    }));
    this.form
      ?.get('lines')
      ?.setValue(
        this.indexDetailsStoreService.yearlySeasonality!.map((yearData: YearlySeasonality) => yearData.Year).slice(-3)
      );
    this.form
      ?.get('fills')
      ?.setValue(
        this.indexDetailsStoreService.yearlySeasonality!.map((yearData: YearlySeasonality) => yearData.Year).slice(-5)
      );
    this.refreshYearlySeasonalLayout$.next({
      xaxis: { title: { text: 'Months' } },
      yaxis: {
        title: {
          text: this.indexDetailsStoreService.indexCurrencyAndUnit,
        },
      },
    });
  }

  private loadYearlySeasonalData(form: any) {
    const fillAreaMax: number[] = [];
    const fillAreaMin: number[] = [];
    monthsOrder.map((month) => {
      const monthsArray = this.indexDetailsStoreService
        .yearlySeasonality!.filter(
        (yearData: YearlySeasonality) => form.fills.includes(yearData.Year) && yearData[month]
      )
        .map((yearData: YearlySeasonality) => yearData[month]);
      fillAreaMax.push(Math.max(...monthsArray));
      fillAreaMin.push(Math.min(...monthsArray));
    });

    this.yearlySeasonalData = [
      ...this.indexDetailsStoreService
        .yearlySeasonality!.filter((yearData: YearlySeasonality) => form.lines.includes(yearData.Year))
        .map((yearData: YearlySeasonality, i: number) => ({
          // Yearly Seasonality
          x: monthsOrder,
          y: monthsOrder.map((month) => yearData[month]),
          type: PlotlyGraphTypes.Scatter,
          mode: PlotlyModeTypes.LinesAndMarkers,
          name: yearData.Year.toString(),
          line: { width: 1, color: colorArray[i] },
          marker: { size: 5, color: colorArray[i] },
          xaxis: PlotlyAxisTypes.X,
          yaxis: PlotlyAxisTypes.Y,
        })),
      {
        // Fill shadow
        x: [...monthsOrder, ...[...monthsOrder].reverse()],
        y: [...fillAreaMin, ...fillAreaMax.reverse()],
        type: PlotlyGraphTypes.Scatter,
        mode: PlotlyModeTypes.Lines,
        fill: PlotlyFillTypes.ToSelf,
        fillcolor: PlotlyTraceColors.TransparentPrimary,
        name: 'Seasonal Range',
        hoverinfo: PlotlyHoverInfoTypes.Skip,
        line: { color: PlotlyTraceColors.Transparent, width: 2 },
      },
    ];
  }
}
