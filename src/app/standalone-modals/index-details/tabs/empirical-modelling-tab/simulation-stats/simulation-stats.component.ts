import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';

import {
  EmPercentileTable,
  EmpiricalModellingResults,
  EmStatsTable,
} from '../../../../../core/models/empirical-modelling.model';
import { statsTableRowOne, statsTableRowTwo } from '../historical-payoff-data-table.config';

@Component({
  selector: 'dd-simulation-stats',
  templateUrl: './simulation-stats.component.html',
  styleUrls: ['./simulation-stats.component.scss'],
})
export class SimulationStatsComponent implements OnInit, OnDestroy {
  @Input() loadStatsTable$: Subject<any>;

  statsTableRowOneColumns = statsTableRowOne;
  statsTableRowOneDisplayedColumns = this.statsTableRowOneColumns.map((x) => x.name);
  statsTableRowTwoColumns = statsTableRowTwo;
  statsTableRowTwoDisplayedColumns = this.statsTableRowTwoColumns.map((x) => x.name);

  netPositionSimulationRowOne = new MatTableDataSource<EmPercentileTable>([]);
  netPositionSimulationRowTwo = new MatTableDataSource<EmStatsTable>([]);
  payOffSimulationRowOne = new MatTableDataSource<EmPercentileTable>([]);
  payOffSimulationRowTwo = new MatTableDataSource<EmStatsTable>([]);
  positivePayOffSimulationRowOne = new MatTableDataSource<EmPercentileTable>([]);
  positivePayOffSimulationRowTwo = new MatTableDataSource<EmStatsTable>([]);

  private unsubscribeAll: Subject<any> = new Subject<any>();

  constructor() {
  }

  ngOnInit(): void {
    if (this.loadStatsTable$) {
      this.loadStatsTable$.pipe(takeUntil(this.unsubscribeAll)).subscribe((empiricalModellingResults) => {
        if (empiricalModellingResults) {
          this.loadStatsTable(empiricalModellingResults);
        }
      });
    }
  }

  ngOnDestroy() {
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }

  private loadStatsTable(empiricalModellingResults: EmpiricalModellingResults) {
    this.netPositionSimulationRowOne.data = [empiricalModellingResults!.net_pos_stats![0]];
    this.netPositionSimulationRowTwo.data = [empiricalModellingResults!.net_pos_stats![1]];
    this.payOffSimulationRowOne.data = [empiricalModellingResults!.pay_off_stats![0]];
    this.payOffSimulationRowTwo.data = [empiricalModellingResults!.pay_off_stats![1]];
    this.positivePayOffSimulationRowOne.data = [empiricalModellingResults!.positive_pay_off_stats![0]];
    this.positivePayOffSimulationRowTwo.data = [empiricalModellingResults!.positive_pay_off_stats![1]];
  }
}
