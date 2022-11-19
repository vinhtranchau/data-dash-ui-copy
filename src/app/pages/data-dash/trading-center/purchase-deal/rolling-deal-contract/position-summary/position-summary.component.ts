import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { merge, Subject } from 'rxjs';
import { RollingDealContractConfigForm } from '../../../../../../core/strict-typed-forms/trading-center.form';
import { getCoverageEnd, getCoverageStart } from '../../../../../../core/utils/dates.util';
import { PlotlyData } from '../../../../../../ui-kit/graph-kit/plotly-chart.models';
import {
  PlotlyGraphTypes,
  PlotlyLineDashTypes,
  PlotlyModeTypes,
  PlotlyTraceColors,
} from '../../../../../../ui-kit/graph-kit/plotly-chart.options';

@Component({
  selector: 'dd-position-summary',
  templateUrl: './position-summary.component.html',
  styleUrls: ['./position-summary.component.scss'],
})
export class PositionSummaryComponent implements OnInit {
  @Input() configForm: FormGroup<RollingDealContractConfigForm>;

  refreshPositionSummaryLayout$ = new Subject<any>();
  positionSummaryData: PlotlyData[] = [];
  startingLayout = {
    hovermode: 'closest',
    yaxis: { visible: false },
    xaxis: { gridcolor: 'rgba(0,0,0,0.1)', showgrid: true },
    margin: { l: 20, t: 10, b: 30, r: 20 },
  };

  private unsubscribeAll: Subject<any> = new Subject<any>();

  constructor() {}

  ngOnInit(): void {
    if (this.configForm) {
      merge(
        this.configForm.get('sellingMonths')!.valueChanges,
        this.configForm.get('startingDelay')!.valueChanges,
        this.configForm.get('duration')!.valueChanges
      ).subscribe(() => {
        this.refreshPlot();
      });
    }
  }

  private refreshPlot() {
    this.positionSummaryData = [];
    const startingDelays = this.configForm.get('startingDelay')?.value;
    const duration = this.configForm.get('duration')?.value;
    const sellingMonths = this.configForm.get('sellingMonths')?.value;
    if (sellingMonths) {
      let yValue = -1;
      sellingMonths.forEach((sellingMonth: number) => {
        this.positionSummaryData.push({
          x: [getCoverageStart(sellingMonth), getCoverageStart(sellingMonth + startingDelays)],
          y: [yValue, yValue],
          type: PlotlyGraphTypes.Scatter,
          mode: PlotlyModeTypes.LinesAndMarkers,
          name: `Deal ${-yValue}`,
          line: {
            width: 1,
            dash: PlotlyLineDashTypes.Dash,
            color: PlotlyTraceColors.Primary100,
          },
        });
        this.positionSummaryData.push({
          x: [
            getCoverageStart(sellingMonth + startingDelays),
            getCoverageEnd(sellingMonth + startingDelays + duration - 1),
          ],
          y: [yValue, yValue],
          type: PlotlyGraphTypes.Scatter,
          mode: PlotlyModeTypes.LinesAndMarkers,
          name: `Deal ${-yValue}`,
          line: {
            width: 1,
            dash: PlotlyLineDashTypes.Solid,
            color: PlotlyTraceColors.Primary100,
          },
        });
        yValue -= 1;
      });
    }
    this.refreshPositionSummaryLayout$.next(this.startingLayout);
  }
}
