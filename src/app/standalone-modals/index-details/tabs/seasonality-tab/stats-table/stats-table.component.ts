import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'dd-stats-table',
  templateUrl: './stats-table.component.html',
  styleUrls: ['./stats-table.component.scss'],
})
export class StatsTableComponent implements OnInit, OnDestroy {
  @Input() data: Record<any, any>[];
  @Input() hoverData: Record<any, any>[];
  @Input() indexColumn: string;
  @Input() columnOrder: string[];
  @Input() isPercentage: boolean = false;
  @Input() filterRows: boolean = false;
  @Input() displayRows$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([2, 4, 6, 8, 10, 12, 24]);

  displayedData: Record<any, any>[];
  minNum: number;
  maxNum: number;
  private unsubscribeAll: Subject<any> = new Subject();

  ngOnInit(): void {
    this.displayedData = this.data;
    this.calcMinMax();
    if (this.filterRows) {
      this.displayRows$.pipe(takeUntil(this.unsubscribeAll)).subscribe((maturities: number[]) => {
        this.displayedData = this.data.filter((item) => maturities.includes(item['Maturity']));
        this.calcMinMax();
      });
    }
  }

  getNumericValues(objs: Record<any, any>[]) {
    const values = [];
    for (let obj of objs) {
      const keys = Object.keys(obj);
      for (let key of keys) {
        if (key !== this.indexColumn && !isNaN(obj[key])) {
          values.push(obj[key]);
        }
      }
    }
    return values;
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }

  calcMinMax() {
    const numbers = this.getNumericValues(this.displayedData);
    this.minNum = Math.min(...numbers);
    this.maxNum = Math.max(...numbers);
  }
}
