import { Component, OnDestroy, OnInit } from '@angular/core';
import { IndexDetailsStoreService } from '../../../index-details-store.service';
import { LoadingSpinner } from '../../../../../ui-kit/spinner/spinner';

@Component({
  selector: 'dd-statistics-sidebar',
  templateUrl: './statistics-sidebar.component.html',
  styleUrls: ['./statistics-sidebar.component.scss'],
})
export class StatisticsSidebarComponent implements OnInit, OnDestroy {
  indexStatistics$ = this.indexDetailsStoreService.indexStatistics$.asObservable();

  spinner: LoadingSpinner<{ indexStatistics: boolean }>;

  constructor(private indexDetailsStoreService: IndexDetailsStoreService) {
  }

  async ngOnInit() {
    this.spinner = new LoadingSpinner({
      indexStatistics: 'Loading index statistics...',
    });
    this.spinner.loaders.indexStatistics.show();
    await this.indexDetailsStoreService.loadStatistics();
    this.spinner.loaders.indexStatistics.hide();
  }

  ngOnDestroy(): void {
    this.spinner.destroy();
  }
}
