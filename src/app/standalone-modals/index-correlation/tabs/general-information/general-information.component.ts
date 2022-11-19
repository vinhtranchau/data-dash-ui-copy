import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject, filter, firstValueFrom, Subject, takeUntil } from 'rxjs';
import { standaloneModalRoute } from '../../../../core/routes/standalone-modal.route';
import { CommonService } from '../../../../core/services/common.service';
import { getDecimal } from '../../../../core/utils/number.util';
import { PlotlyData } from '../../../../ui-kit/graph-kit/plotly-chart.models';
import {
  PlotlyAxisTypes,
  PlotlyFillTypes,
  PlotlyGraphTypes,
  PlotlyModeTypes,
  PlotlyTraceColors,
} from '../../../../ui-kit/graph-kit/plotly-chart.options';
import { IndexCorrelationDialogComponent } from '../../index-correlation-dialog/index-correlation-dialog.component';
import { IndexCorrelationStoreService } from '../../index-correlation-store.service';

@Component({
  selector: 'dd-general-information',
  templateUrl: './general-information.component.html',
  styleUrls: ['./general-information.component.scss'],
})
export class GeneralInformationComponent implements OnInit, OnDestroy {
  @Input() fullscreen: boolean;
  @Input() isMonthly$: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  indexLinePlotLayout: any;
  indexLinePlot: PlotlyData[];
  refreshIndexLinePlotLayout$ = new Subject<any>();
  private unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    public indexCorrelationStoreService: IndexCorrelationStoreService,
    private commonService: CommonService,
    private dialogRef: MatDialogRef<IndexCorrelationDialogComponent>
  ) {}

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
    const correlation = isMonthly
      ? this.indexCorrelationStoreService.comparisonChartsData?.monthly_correlation
      : this.indexCorrelationStoreService.comparisonChartsData?.correlation;
    this.indexLinePlot = [
      {
        x: lineX,
        y: lineY,
        type: PlotlyGraphTypes.Scatter,
        mode: PlotlyModeTypes.LinesAndMarkers,
        name: this.indexCorrelationStoreService.indexDetails1?.stable_index_code,
        fill: PlotlyFillTypes.ToZeroY,
        fillcolor: PlotlyTraceColors.Transparent,
        line: { color: PlotlyTraceColors.Primary100, width: 2 },
        marker: { color: PlotlyTraceColors.Primary100, size: 2 },
      },
      {
        x: line2X,
        y: line2Y,
        type: PlotlyGraphTypes.Scatter,
        mode: PlotlyModeTypes.LinesAndMarkers,
        name: this.indexCorrelationStoreService.indexDetails2?.stable_index_code,
        fill: PlotlyFillTypes.ToZeroY,
        fillcolor: PlotlyTraceColors.Transparent,
        line: { color: PlotlyTraceColors.Accent100, width: 2 },
        marker: { color: PlotlyTraceColors.Accent100, size: 2 },
        yaxis: PlotlyAxisTypes.Y2,
      },
    ];
    this.indexLinePlotLayout = {
      xaxis: { title: { text: 'Dates' } },
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
        r: 60,
      },
      annotations: [
        {
          x: 0.98,
          y: 0.02,
          xanchor: 'right',
          yanchor: 'bottom',
          xref: 'paper',
          yref: 'paper',
          showarrow: false,
          text: `Correlation: ${getDecimal(correlation, 4)}`,
        },
      ],
    };
    this.refreshIndexLinePlotLayout$.next(this.indexLinePlotLayout);
  }

  routeIndex(indexId: string) {
    const indexIdUrl = `${standaloneModalRoute.root}/${standaloneModalRoute.indexDetails}/${indexId}/0`;
    if (window.innerWidth < 768) {
      // For mobile
      this.dialogRef.close();
      setTimeout(() => {
        this.commonService.openStandaloneModal(indexIdUrl, false); // Always open modal only
      }, 400);
    } else {
      this.commonService.openStandaloneModal(indexIdUrl, !this.fullscreen);
    }
  }
}
