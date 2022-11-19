import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject, filter, firstValueFrom } from 'rxjs';
import { IndexCorrelationStoreService } from '../index-correlation-store.service';

@Component({
  selector: 'dd-index-correlation-dialog',
  templateUrl: './index-correlation-dialog.component.html',
  styleUrls: ['./index-correlation-dialog.component.scss'],
})
export class IndexCorrelationDialogComponent implements OnInit {
  fullscreen: boolean = false;
  indexId1: string = '';
  indexId2: string = '';
  isMonthly: boolean = true
  isMonthly$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true)

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public indexCorrelationStoreService: IndexCorrelationStoreService,
  ) {
    this.fullscreen = data.fullscreen;
    this.indexId1 = data.indexId1;
    this.indexId2 = data.indexId2;
  }

  async ngOnInit() {
    this.indexCorrelationStoreService.indexId1 = this.indexId1;
    this.indexCorrelationStoreService.indexId2 = this.indexId2;
    this.indexCorrelationStoreService.startStore();
    this.indexCorrelationStoreService.loadIndexDetails().then();
    this.indexCorrelationStoreService.loadChartData().then();
    // Wait until all primary data loading is finished...
    await firstValueFrom(this.indexCorrelationStoreService.spinner.isLoading$.pipe(filter((isLoading) => !isLoading)));
  }

  ngOnDestroy() {
    this.indexCorrelationStoreService.destroySpinners();
  }

  switchMonthlyFrequency() {
    this.isMonthly$.next(this.isMonthly);
  }

}
