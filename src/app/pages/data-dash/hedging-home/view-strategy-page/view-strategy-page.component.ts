import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SelectionChange } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom, Subject } from 'rxjs';

import { Index, IndexPrice } from '../../../../core/models/index.model';
import { GeneratedStrategies, HedgingStrategy, HedgingStrategyDetail } from '../../../../core/models/hedging.model';
import { HedgingService } from '../../../../core/services/hedging.service';
import { IndexService } from '../../../../core/services/index.service';
import { IndexLibraryService } from '../../../../core/services/index-library.service';
import { ToastService } from '../../../../ui-kit/toast/toast.service';

@Component({
  selector: 'dd-view-strategy-page',
  templateUrl: './view-strategy-page.component.html',
  styleUrls: ['./view-strategy-page.component.scss'],
})
export class ViewStrategyPageComponent implements OnInit {
  data: GeneratedStrategies | null;
  index: Index;
  indexPrices: IndexPrice[] = [];
  hedgingStrategyDataSource: MatTableDataSource<HedgingStrategy> = new MatTableDataSource<HedgingStrategy>([]);

  selectedStrategy: HedgingStrategy;
  selectedStrategyDetail: HedgingStrategyDetail;

  isDataLoading = false;
  isStrategyDetailLoading = false;
  isLoading = false;
  hasLoadingError = false;

  refreshPlots$: Subject<HedgingStrategyDetail> = new Subject<HedgingStrategyDetail>();

  constructor(
    private route: ActivatedRoute,
    private hedgingService: HedgingService,
    private indexService: IndexService,
    private indexLibraryService: IndexLibraryService,
    private toast: ToastService
  ) {}

  async ngOnInit() {
    const params = this.route.snapshot.params;
    const { id } = params;
    this.loadStrategies(id).then();
  }

  async onSelectStrategy(selection: SelectionChange<HedgingStrategy>) {
    this.selectedStrategy = selection.added[0];
    if (this.selectedStrategy) {
      await this.getStrategyDetails();
    }
    this.refreshPlots$.next(this.selectedStrategyDetail);
  }

  private async loadStrategies(strategyId: string) {
    try {
      this.hasLoadingError = false;
      this.isDataLoading = true;
      this.data = await firstValueFrom(this.hedgingService.getStrategies(strategyId));
      this.hedgingStrategyDataSource.data = this.data.hedging_strategies;
      const { index_details_id } = this.data;
      this.loadIndexDetail(index_details_id).then();
      this.loadIndexPrices(index_details_id).then();
    } catch (e) {
      this.hasLoadingError = true;
    } finally {
      this.isDataLoading = false;
    }
  }

  private async loadIndexDetail(indexId: string) {
    try {
      this.index = await firstValueFrom(this.indexService.getIndex(indexId));
    } catch (e) {
      this.toast.error('Failed to load index details.');
    }
  }

  private async loadIndexPrices(indexId: string) {
    try {
      this.indexPrices = await firstValueFrom(this.indexLibraryService.getIndexPrices(indexId));
    } catch (e) {
      this.toast.error('Failed to fetch index prices.');
    }
  }

  private async getStrategyDetails() {
    try {
      this.isStrategyDetailLoading = true;
      this.selectedStrategyDetail = await firstValueFrom(
        this.hedgingService.getStrategyDetail(this.selectedStrategy.hedging_id)
      );
    } catch (e) {
      this.toast.error('Failed to load strategy details.');
    } finally {
      this.isStrategyDetailLoading = false;
    }
  }
}
