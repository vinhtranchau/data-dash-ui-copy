import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { PlotlyData } from '../../../../../ui-kit/graph-kit/plotly-chart.models';
import { EmpiricalModellingResults } from '../../../../../core/models/empirical-modelling.model';
import {
  PlotlyGraphTypes,
  PlotlyHistNormTypes,
  PlotlyHoverInfoTypes,
  PlotlyLineDashTypes,
  PlotlyModeTypes,
  PlotlyTraceColors,
} from '../../../../../ui-kit/graph-kit/plotly-chart.options';
import { IndexDetailsStoreService } from '../../../index-details-store.service';

@Component({
  selector: 'dd-net-position',
  templateUrl: './net-position.component.html',
  styleUrls: ['./net-position.component.scss'],
})
export class NetPositionComponent implements OnInit, OnDestroy {
  @Input() loadNetPositionPlots$: Subject<EmpiricalModellingResults | null>;

  netPositionPlotData: PlotlyData[] = [];
  netPositionPlotLayout: any = {};
  refreshNetPositionPlotLayout$ = new Subject<any>();
  netPositionAcfData: PlotlyData[] = [];
  netPositionAcfLayout: any = {};
  refreshNetPositionAcfLayout$ = new Subject<any>();
  netPositionDistributionData: PlotlyData[] = [];
  netPositionDistributionLayout: any = {};
  refreshNetPositionDistributionLayout$ = new Subject<any>();

  private unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private indexDetailsStoreService: IndexDetailsStoreService) {
  }

  ngOnInit(): void {
    if (this.loadNetPositionPlots$) {
      this.loadNetPositionPlots$.pipe(takeUntil(this.unsubscribeAll)).subscribe((empiricalModellingResults) => {
        if (empiricalModellingResults) {
          this.loadNetPositionPlots(empiricalModellingResults);
        }
      });
    }
  }

  ngOnDestroy() {
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }

  private loadNetPositionPlots(empiricalModellingResults: EmpiricalModellingResults) {
    this.netPositionPlotLayout = {
      xaxis: { title: { text: 'Dates' } },
      yaxis: {
        title: {
          text: this.indexDetailsStoreService.indexCurrencyAndUnit,
        },
      },
    };
    this.netPositionPlotData = [
      {
        x: empiricalModellingResults?.total_payoff.map((item) => item.dates),
        y: empiricalModellingResults?.total_payoff.map((item) => 0),
        type: PlotlyGraphTypes.Scatter,
        mode: PlotlyModeTypes.Lines,
        hoverinfo: PlotlyHoverInfoTypes.Skip,
        name: '0 Line',
        line: { width: 1, color: PlotlyTraceColors.Gray, dash: PlotlyLineDashTypes.Dot },
      },
      {
        x: empiricalModellingResults?.total_payoff.map((item) => item.dates),
        y: empiricalModellingResults?.total_payoff.map((item) => item.net_position),
        type: PlotlyGraphTypes.Scatter,
        mode: PlotlyModeTypes.Lines,
        name: 'Net Position',
        line: { width: 2, color: PlotlyTraceColors.Primary100 },
      },
    ];
    this.refreshNetPositionPlotLayout$.next(this.netPositionPlotLayout);

    this.netPositionAcfLayout = {
      xaxis: { title: { text: 'Lag' } },
      yaxis: { title: { text: 'Correlation' } },
    };
    this.netPositionAcfData = [
      {
        x: [...Array(empiricalModellingResults?.net_pos_acf.length).keys()],
        y: empiricalModellingResults?.net_pos_acf,
        type: PlotlyGraphTypes.Bar,
        name: 'ACF',
        marker: { color: PlotlyTraceColors.Primary100 },
      },
      {
        x: [...Array(empiricalModellingResults?.net_pos_pacf.length).keys()],
        y: empiricalModellingResults?.net_pos_pacf,
        type: PlotlyGraphTypes.Bar,
        name: 'PACF',
        marker: { color: PlotlyTraceColors.Accent100 },
      },
    ];
    this.refreshNetPositionAcfLayout$.next(this.netPositionAcfLayout);

    this.netPositionDistributionLayout = {
      xaxis: { title: { text: 'Net Position' } },
      yaxis: { title: { text: 'Probability Density' } },
    };
    this.netPositionDistributionData = [
      {
        x: empiricalModellingResults?.total_payoff.map((item) => item.net_position),
        nbinsx: Math.min(100, Math.floor(empiricalModellingResults!.total_payoff.length / 3)),
        type: PlotlyGraphTypes.Histogram,
        name: 'Histogram',
        histnorm: PlotlyHistNormTypes.ProbabilityDensity,
        marker: { color: PlotlyTraceColors.Primary100 },
      },
      {
        x: empiricalModellingResults?.hist_curve_x,
        y: empiricalModellingResults?.hist_curve_y,
        type: PlotlyGraphTypes.Scatter,
        mode: PlotlyModeTypes.Lines,
        name: 'Smoothed Density',
        line: { width: 2, color: PlotlyTraceColors.Accent100 },
      },
    ];
    this.refreshNetPositionDistributionLayout$.next(this.netPositionDistributionLayout);
  }
}
