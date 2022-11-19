import { Injectable } from '@angular/core';
import { firstValueFrom, map, ReplaySubject } from 'rxjs';

import { LoadingSpinner } from '../../ui-kit/spinner/spinner';
import { IndexService } from '../../core/services/index.service';
import { IndexFlattened } from '../../core/models/index.model';
import { ToastService } from '../../ui-kit/toast/toast.service';
import { getCurrencyAndUnit, parseIndexDetails } from '../../core/utils/index-detail.util';
import { ComparisonChartsData } from '../../core/models/index-correlation.model';
import { IndexCorrelationService } from '../../core/services/index-correlation.service';

@Injectable()
export class IndexCorrelationStoreService {
  indexId1: string;
  indexId2: string;

  spinner: LoadingSpinner<{ indexDetails1: boolean; indexDetails2: boolean; indexComparisonCharts: boolean }>;
  indexDetails1: IndexFlattened | null;
  indexDetails1$: ReplaySubject<IndexFlattened> = new ReplaySubject<IndexFlattened>(1);
  indexCurrencyAndUnit1: string;
  indexDetails2: IndexFlattened | null;
  indexDetails2$: ReplaySubject<IndexFlattened> = new ReplaySubject<IndexFlattened>(1);
  indexCurrencyAndUnit2: string;

  comparisonChartsData: ComparisonChartsData | null;
  comparisonChartsData$: ReplaySubject<ComparisonChartsData> = new ReplaySubject<ComparisonChartsData>(1);

  constructor(
    private indexService: IndexService,
    private indexCorrelationService: IndexCorrelationService,
    private toast: ToastService
  ) {}

  startStore() {
    this.spinner = new LoadingSpinner({
      indexDetails1: 'Loading index details...',
      indexDetails2: 'Loading index details...',
      indexComparisonCharts: 'Loading index comparisons...',
    });
    this.comparisonChartsData = null;
  }

  destroySpinners() {
    this.spinner.destroy();
  }

  async loadIndexDetails() {
    try {
      this.spinner.loaders.indexDetails1.show();
      this.spinner.loaders.indexDetails2.show();
      this.indexDetails1 = await firstValueFrom(
        this.indexService.getIndex(this.indexId1).pipe(map((item) => parseIndexDetails(item)))
      );
      this.indexDetails1$.next(this.indexDetails1);
      this.indexCurrencyAndUnit1 = getCurrencyAndUnit(this.indexDetails1);
      this.indexDetails2 = await firstValueFrom(
        this.indexService.getIndex(this.indexId2).pipe(map((item) => parseIndexDetails(item)))
      );
      this.indexDetails2$.next(this.indexDetails2);
      this.indexCurrencyAndUnit2 = getCurrencyAndUnit(this.indexDetails2);
    } catch (e) {
      this.toast.error('Failed to fetch indexes details.');
    } finally {
      this.spinner.loaders.indexDetails1.hide();
      this.spinner.loaders.indexDetails2.hide();
    }
  }

  async loadChartData() {
    try {
      this.spinner.loaders.indexComparisonCharts.show();

      this.comparisonChartsData = await firstValueFrom(
        this.indexCorrelationService.getComparisonChartData(this.indexId1, this.indexId2).pipe(map((res) => res.data))
      );
      this.comparisonChartsData$.next(this.comparisonChartsData);
    } catch (e) {
      this.toast.error('Failed to fetch indexes comparison data.');
    } finally {
      this.spinner.loaders.indexComparisonCharts.hide();
    }
  }
}
