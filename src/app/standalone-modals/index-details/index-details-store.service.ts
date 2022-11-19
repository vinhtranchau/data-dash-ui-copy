import { Injectable } from '@angular/core';
import { firstValueFrom, map, ReplaySubject } from 'rxjs';

import { LoadingSpinner } from '../../ui-kit/spinner/spinner';
import { IndexService } from '../../core/services/index.service';
import { IndexFlattened, IndexPrice } from '../../core/models/index.model';
import { IndexStatistics, SeasonalStatistics, YearlySeasonality } from '../../core/models/index-statistics.model';
import { ToastService } from '../../ui-kit/toast/toast.service';
import { getCurrencyAndUnit, parseIndexDetails } from '../../core/utils/index-detail.util';
import { IndexLibraryService } from '../../core/services/index-library.service';

@Injectable()
export class IndexDetailsStoreService {
  indexId: string;

  // Primary data which will be used in all tabs
  indexDetails: IndexFlattened;
  indexDetails$: ReplaySubject<IndexFlattened> = new ReplaySubject<IndexFlattened>(1);

  indexPrices: IndexPrice[] = [];
  indexPrices$: ReplaySubject<IndexPrice[]> = new ReplaySubject<IndexPrice[]>(1);

  indexCurrencyAndUnit: string;

  spinner: LoadingSpinner<{ indexDetails: boolean; indexPrices: boolean }>;

  // Secondary data which will be used only in specific tabs
  indexStatistics: IndexStatistics | null;
  indexStatistics$: ReplaySubject<IndexStatistics | null> = new ReplaySubject<IndexStatistics | null>(1);

  seasonalStatistics: SeasonalStatistics | null;
  seasonalStatistics$: ReplaySubject<SeasonalStatistics | null> = new ReplaySubject<SeasonalStatistics | null>(1);

  yearlySeasonality: YearlySeasonality[] | null;
  yearlySeasonality$: ReplaySubject<YearlySeasonality[] | null> = new ReplaySubject<YearlySeasonality[] | null>(1);

  constructor(
    private indexService: IndexService,
    private indexLibraryService: IndexLibraryService,
    private toast: ToastService
  ) {}

  startStore() {
    this.spinner = new LoadingSpinner({
      indexDetails: 'Loading index details...',
      indexPrices: 'Loading index prices...',
    });

    // Reset secondary data
    this.indexStatistics = null;
    this.seasonalStatistics = null;
    this.yearlySeasonality = null;

    this.indexStatistics$.next(this.indexStatistics);
    this.seasonalStatistics$.next(this.seasonalStatistics);
    this.yearlySeasonality$.next(this.yearlySeasonality);
  }

  destroySpinners() {
    this.spinner.destroy();
  }

  async loadIndexDetails() {
    try {
      this.spinner.loaders.indexDetails.show();
      this.indexDetails = await firstValueFrom(
        this.indexService.getIndex(this.indexId).pipe(map((item) => parseIndexDetails(item)))
      );
      this.indexDetails$.next(this.indexDetails);

      this.indexCurrencyAndUnit = getCurrencyAndUnit(this.indexDetails);
    } catch (e) {
      this.toast.error('Failed to fetch index details.');
    } finally {
      this.spinner.loaders.indexDetails.hide();
    }
  }

  async loadIndexPrices() {
    try {
      this.spinner.loaders.indexPrices.show();
      this.indexPrices = await firstValueFrom(this.indexLibraryService.getIndexPrices(this.indexId));
      this.indexPrices$.next(this.indexPrices);
    } catch (e) {
      this.indexPrices = [];
      this.indexPrices$.next(this.indexPrices);
      this.toast.error('Failed to fetch index prices.');
    } finally {
      this.spinner.loaders.indexPrices.hide();
    }
  }

  async loadStatistics(forceReload = false) {
    try {
      if (this.indexStatistics && !forceReload) {
        // Do not load data again, if there's already data fetched in the store.
        return;
      }

      this.indexStatistics = await firstValueFrom(this.indexLibraryService.getIndexStatistics(this.indexId));
      this.indexStatistics$.next(this.indexStatistics);
    } catch (e) {
      this.indexStatistics = null;
      this.indexStatistics$.next(null);
      this.toast.error('Failed to fetch index statistics.');
    }
  }

  async loadSeasonalStatistics(forceReload = false) {
    try {
      if (this.seasonalStatistics && !forceReload) {
        // Do not load data again, if there's already data fetched in the store.
        return;
      }
      const { data: results } = await firstValueFrom(this.indexLibraryService.seasonalStatistics(this.indexId));
      this.seasonalStatistics = results;
      this.seasonalStatistics$.next(this.seasonalStatistics);
    } catch (e) {
      this.toast.error('Failed to fetch seasonal statistics.');
    }
  }

  async loadYearlySeasonality(forceReload = false) {
    try {
      if (this.yearlySeasonality && !forceReload) {
        // Do not load data again, if there's already data fetched in the store.
        return;
      }
      this.yearlySeasonality = await firstValueFrom(this.indexLibraryService.yearlySeasonality(this.indexId));
      this.yearlySeasonality$.next(this.yearlySeasonality);
    } catch (e) {
      this.toast.error('Failed to fetch yearly seasonality');
    }
  }
}
