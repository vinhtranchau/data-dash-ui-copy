import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { filter, firstValueFrom } from 'rxjs';

import { IndexDetailsStoreService } from '../index-details-store.service';
import { StoreService } from '../../../core/services/store.service';
import { dataDashRoute } from '../../../core/routes/data-dash.route';
import { standaloneModalRoute, standaloneModalRouteOutlet } from '../../../core/routes/standalone-modal.route';
import { IndexSearchService } from 'src/app/pages/data-dash/index-library/index-search/index-search.service';
import { IndexLibraryService } from '../../../core/services/index-library.service';

@Component({
  selector: 'dd-index-details-dialog',
  templateUrl: './index-details-dialog.component.html',
  styleUrls: ['./index-details-dialog.component.scss'],
})
export class IndexDetailsDialogComponent implements OnInit, OnDestroy {
  dataDashRoute = dataDashRoute;
  standaloneModalRoute = standaloneModalRoute;
  standaloneModalRouteOutlet = standaloneModalRouteOutlet;

  id: string;
  tab: number;
  fullscreen = false;
  isFavorite = false;
  hasLoaded: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public indexDetailsStoreService: IndexDetailsStoreService,
    private store: StoreService,
    public indexSearchService: IndexSearchService,
    private indexLibraryService: IndexLibraryService,
  ) {
    this.id = data.id;
    this.tab = data.tab || 0;
    this.fullscreen = data.fullscreen;

    this.indexDetailsStoreService.indexId = this.id;
  }

  async ngOnInit() {
    this.store.loadIndexUUIDs();
    this.postActivity();
    this.indexDetailsStoreService.startStore();
    this.indexDetailsStoreService.loadIndexDetails().then();
    this.indexDetailsStoreService.loadIndexPrices().then();
    // Wait until all primary data loading is finished...
    await firstValueFrom(this.indexDetailsStoreService.spinner.isLoading$.pipe(filter((isLoading) => !isLoading)));
    this.hasLoaded = true;
    this.isFavorite = this.indexDetailsStoreService.indexDetails?.is_favorite;
  }

  async updateFavorite() {
    this.isFavorite = !this.isFavorite;
    await firstValueFrom(this.indexLibraryService.postFavorite(this.id));
    this.indexSearchService.indexes.map((el) => {
      if (el.id === this.id) {
        el.is_favorite = this.isFavorite;
      }
    });
  }

  ngOnDestroy() {
    this.indexDetailsStoreService.destroySpinners();
  }

  async postActivity() {
    try {
      await firstValueFrom(
        this.indexLibraryService.postIndexActivity({
          index_detail_id: this.id,
        })
      );
    } catch (error) {
    }
  }
}
