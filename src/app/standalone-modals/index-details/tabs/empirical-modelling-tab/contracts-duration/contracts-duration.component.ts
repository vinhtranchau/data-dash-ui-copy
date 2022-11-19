import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';

import {
  PlotlyGraphTypes,
  PlotlyLineDashTypes,
  PlotlyModeTypes,
  PlotlyTraceColors,
} from '../../../../../ui-kit/graph-kit/plotly-chart.options';
import { OptionTypes, SellingMonths } from '../../../../../core/models/empirical-modelling.model';
import { PlotlyData } from '../../../../../ui-kit/graph-kit/plotly-chart.models';
import { getDateFromMonthNumber } from '../../../../../core/utils/dates.util';
import { EmpiricalModellingContract } from '../../../../../core/strict-typed-forms/risk-analysis.form';

@Component({
  selector: 'dd-contracts-duration',
  templateUrl: './contracts-duration.component.html',
  styleUrls: ['./contracts-duration.component.scss'],
})
export class ContractsDurationComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() formChange$: BehaviorSubject<EmpiricalModellingContract[]>;
  @Input() fullscreen: boolean;

  refreshContractPreviewLayout$ = new Subject<any>();
  contractsPreviewData: PlotlyData[] = [];

  private unsubscribeAll: Subject<any> = new Subject<any>();

  constructor() {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    if (this.formChange$) {
      this.formChange$.pipe(takeUntil(this.unsubscribeAll)).subscribe((contracts) => {
        this.calcContractPreview(contracts);
      });
    }
  }

  ngOnDestroy() {
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }

  private calcContractPreview(contracts: EmpiricalModellingContract[]) {
    this.contractsPreviewData = [];
    let yValue = 1;
    contracts.forEach((contract: EmpiricalModellingContract) => {
      let sellingMonths = [];
      if (contract.sellingMonth.includes(SellingMonths.AllMonths)) {
        // Replace 'all_months' with [0, 1, ..., 11]
        sellingMonths = [...Array(12).keys()];
      } else {
        sellingMonths = contract.sellingMonth;
      }
      // Plot one line per selling month per contract group
      sellingMonths.forEach((month) => {
        this.contractsPreviewData.push({
          // Dash lines between selling month and policy start
          x: [getDateFromMonthNumber(Number(month)), getDateFromMonthNumber(Number(month) + contract.startingDelay)],
          y: [yValue, yValue],
          type: PlotlyGraphTypes.Scatter,
          mode: PlotlyModeTypes.LinesAndMarkers,
          line: {
            width: 1,
            dash: PlotlyLineDashTypes.Dash,
            color:
              contract.optionType === OptionTypes.Call ? PlotlyTraceColors.Primary100 : PlotlyTraceColors.Accent100,
          },
          marker: {
            size: 5,
            color:
              contract.optionType === OptionTypes.Call ? PlotlyTraceColors.Primary100 : PlotlyTraceColors.Accent100,
          },
        });
        this.contractsPreviewData.push({
          // Solid line between policy start and policy end
          x: [
            getDateFromMonthNumber(Number(month) + contract.startingDelay),
            getDateFromMonthNumber(Number(month) + contract.startingDelay + contract.duration),
          ],
          y: [yValue, yValue],
          type: PlotlyGraphTypes.Scatter,
          mode: PlotlyModeTypes.LinesAndMarkers,
          line: {
            width: 1,
            color:
              contract.optionType === OptionTypes.Call ? PlotlyTraceColors.Primary100 : PlotlyTraceColors.Accent100,
          },
          marker: {
            size: 5,
            color:
              contract.optionType === OptionTypes.Call ? PlotlyTraceColors.Primary100 : PlotlyTraceColors.Accent100,
          },
        });
        yValue -= 1;
      });
    });

    this.refreshContractPreviewLayout$.next({
      hovermode: 'closest',
      yaxis: { visible: false },
      xaxis: { gridcolor: 'rgba(0,0,0,0.1)', showgrid: true },
      margin: { l: 0, t: 0, b: 24 }
    });
  }
}
