import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';

import { statsTableRowOne, statsTableRowTwo } from '../historical-payoff-data-table.config';
import {
  EmPercentileTable,
  EmpiricalModellingResults,
  EmStatsTable,
} from '../../../../../core/models/empirical-modelling.model';

@Component({
  selector: 'dd-empirical-stats',
  templateUrl: './empirical-stats.component.html',
  styleUrls: ['./empirical-stats.component.scss'],
})
export class EmpiricalStatsComponent implements OnInit, OnDestroy {
  @Input() loadStatsTable$: Subject<EmpiricalModellingResults | null>;

  statsTableRowOneColumns = statsTableRowOne;
  statsTableRowOneDisplayedColumns = this.statsTableRowOneColumns.map((x) => x.name);
  statsTableRowTwoColumns = statsTableRowTwo;
  statsTableRowTwoDisplayedColumns = this.statsTableRowTwoColumns.map((x) => x.name);

  netPositionEmpiricalRowOne = new MatTableDataSource<EmPercentileTable>([]);
  netPositionEmpiricalRowTwo = new MatTableDataSource<EmStatsTable>([]);
  payOffEmpiricalRowOne = new MatTableDataSource<EmPercentileTable>([]);
  payOffEmpiricalRowTwo = new MatTableDataSource<EmStatsTable>([]);
  positivePayOffEmpiricalRowOne = new MatTableDataSource<EmPercentileTable>([]);
  positivePayOffEmpiricalRowTwo = new MatTableDataSource<EmStatsTable>([]);

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
    this.netPositionEmpiricalRowOne.data = [empiricalModellingResults!.net_pos_stats_emp![0]];
    this.netPositionEmpiricalRowTwo.data = [empiricalModellingResults!.net_pos_stats_emp![1]];
    this.payOffEmpiricalRowOne.data = [empiricalModellingResults!.pay_off_stats_emp![0]];
    this.payOffEmpiricalRowTwo.data = [empiricalModellingResults!.pay_off_stats_emp![1]];
    this.positivePayOffEmpiricalRowOne.data = [empiricalModellingResults!.positive_pay_off_stats_emp![0]];
    this.positivePayOffEmpiricalRowTwo.data = [empiricalModellingResults!.positive_pay_off_stats_emp![1]];
  }
}
