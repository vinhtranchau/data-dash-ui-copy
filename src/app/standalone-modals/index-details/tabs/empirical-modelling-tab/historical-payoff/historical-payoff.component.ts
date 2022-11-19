import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';

import { PlotlyData } from '../../../../../ui-kit/graph-kit/plotly-chart.models';
import { historicalPayoffDataTable } from '../historical-payoff-data-table.config';
import { EmHistoricalPayoff, EmpiricalModellingResults } from '../../../../../core/models/empirical-modelling.model';
import { removeTimezone } from '../../../../../core/utils/dates.util';
import { IndexDetailsStoreService } from '../../../index-details-store.service';
import {
  PlotlyAxisTypes,
  PlotlyGraphTypes,
  PlotlyLineDashTypes,
  PlotlyModeTypes,
  PlotlyTraceColors,
} from '../../../../../ui-kit/graph-kit/plotly-chart.options';
import { downloadXLS, XLSContentDataType } from '../../../../../core/utils/download-xls.util';

@Component({
  selector: 'dd-historical-payoff',
  templateUrl: './historical-payoff.component.html',
  styleUrls: ['./historical-payoff.component.scss'],
})
export class HistoricalPayoffComponent implements OnInit, OnDestroy {
  @Input() loadHistoricalPayoffPlot$: Subject<EmpiricalModellingResults | null>;

  empiricalModellingResults: EmpiricalModellingResults;
  historicalPayoffColumns = historicalPayoffDataTable;
  historicalPayoffDataSource = new MatTableDataSource<EmHistoricalPayoff>([]);
  historicalPayoffPlotData: PlotlyData[] = [];
  historicalPayoffPlotLayout: any = {};
  historicalPayoffDisplayedColumns = this.historicalPayoffColumns.map((x) => x.name);
  refreshHistoricalPayoffPlotLayout$ = new Subject<any>();

  private unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private indexDetailsStoreService: IndexDetailsStoreService) {
  }

  ngOnInit(): void {
    if (this.loadHistoricalPayoffPlot$) {
      this.loadHistoricalPayoffPlot$.pipe(takeUntil(this.unsubscribeAll)).subscribe((empiricalModellingResults) => {
        if (empiricalModellingResults) {
          this.empiricalModellingResults = empiricalModellingResults;
          this.loadHistoricalPayoffPlot(empiricalModellingResults);
        }
      });
    }
  }

  ngOnDestroy() {
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }

  downloadHistoricalPayoffData() {
    downloadXLS(`Historical_Payoff__${this.indexDetailsStoreService.indexDetails?.stable_index_code}`, [
      {
        name: 'Historical Pay Off',
        type: XLSContentDataType.JSON,
        content: this.empiricalModellingResults!.historical_payoff_table_data.map((row) => ({
          ...row,
          dates: removeTimezone(row.dates),
          policy_start: removeTimezone(row.policy_start),
          policy_end: removeTimezone(row.policy_end),
        })),
      },
    ]);
  }

  private loadHistoricalPayoffPlot(empiricalModellingResults: EmpiricalModellingResults) {
    // Calculate table
    this.historicalPayoffDataSource.data = empiricalModellingResults!.historical_payoff_table_data;
    // Calculate plot
    const payoffs = empiricalModellingResults?.total_payoff.map((item) => item.pay_off);
    this.historicalPayoffPlotLayout = {
      xaxis: {
        title: { text: 'Dates' },
      },
      yaxis: {
        title: {
          text: this.indexDetailsStoreService.indexCurrencyAndUnit,
        },
      },
      yaxis2: {
        range: [0, 5 * Math.max(...(payoffs ? payoffs : [1]))],
        title: {
          text: 'Pay Off',
        },
      },
      margin: {
        r: 60,
      },
    };
    // Main index line
    this.historicalPayoffPlotData = [
      {
        x: empiricalModellingResults!.sic_data.map((item) => item.dates),
        y: empiricalModellingResults!.sic_data.map((item) => item.spot_price),
        type: PlotlyGraphTypes.Scatter,
        mode: PlotlyModeTypes.Lines,
        name: this.indexDetailsStoreService.indexDetails.stable_index_code,
        line: { color: PlotlyTraceColors.Primary100, width: 2 },
      },
    ];
    // Strike and limit lines per config
    empiricalModellingResults!.strike_limit_data.forEach((config) => {
      this.historicalPayoffPlotData = [
        ...this.historicalPayoffPlotData,
        {
          x: config.sic_data.map((item) => item.dates),
          y: config.sic_data.map((item) => item.strike_price),
          type: PlotlyGraphTypes.Scatter,
          mode: PlotlyModeTypes.Lines,
          name: `Config ${config.config_number} Strike`,
          line: { width: 2, dash: PlotlyLineDashTypes.Dot },
        },
        {
          x: config.sic_data.map((item) => item.dates),
          y: config.sic_data.map((item) => item.limit_price),
          type: PlotlyGraphTypes.Scatter,
          mode: PlotlyModeTypes.Lines,
          name: `Config ${config.config_number} Limit`,
          line: { width: 2, dash: PlotlyLineDashTypes.Dot },
        },
      ];
      // Moving average (if available)
      if (Object.keys(config.sic_data?.[0]).includes('moving_average')) {
        this.historicalPayoffPlotData = [
          ...this.historicalPayoffPlotData,
          {
            x: config.sic_data.map((item) => item.dates),
            y: config.sic_data.map((item) => item.moving_average),
            type: PlotlyGraphTypes.Scatter,
            mode: PlotlyModeTypes.Lines,
            name: `Config ${config.config_number} MA`,
            line: { width: 2, dash: PlotlyLineDashTypes.Dot },
          },
        ];
      }
    });
    // Pay off bar chart
    this.historicalPayoffPlotData = [
      ...this.historicalPayoffPlotData,
      {
        x: empiricalModellingResults?.total_payoff.map((item) => item.dates),
        y: payoffs,
        type: PlotlyGraphTypes.Bar,
        name: 'Pay Off',
        marker: { color: PlotlyTraceColors.Accent100, line: { width: 0 } },
        yaxis: PlotlyAxisTypes.Y2,
      },
    ];
    this.refreshHistoricalPayoffPlotLayout$.next(this.historicalPayoffPlotLayout);
  }
}
