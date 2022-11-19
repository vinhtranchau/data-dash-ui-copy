import { Component, OnDestroy, OnInit } from '@angular/core';
import { firstValueFrom, Subject } from 'rxjs';

import { PaginationResponseV2 } from '../../../../../core/models/common.model';
import { ClientIndex } from '../../../../../core/models/trading-center.model';
import { dataDashRoute } from '../../../../../core/routes/data-dash.route';
import { TradingCenterService } from '../../../../../core/services/trading-center.service';

@Component({
  selector: 'dd-favorite-indexes',
  templateUrl: './favorite-indexes.component.html',
  styleUrls: ['./favorite-indexes.component.scss'],
})
export class FavoriteIndexesComponent implements OnInit, OnDestroy {
  dataDashRoute = dataDashRoute;
  indexes: ClientIndex[];

  private rowElement: HTMLElement;
  private pageSize: number;
  private pageNumber: number;
  private total: number;
  private isFavoriteOnly: boolean | undefined = true;
  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(private tradingCenterService: TradingCenterService) {}

  ngOnInit() {
    this.indexes = [];
    this.pageNumber = 1;
    this.pageSize = Math.ceil((window.innerWidth - 65) / 380) + 1;
    this.loadPage();
  }

  async loadPage() {
    const { count, results } = await this.getIndexes();
    this.total = count;
    this.indexes.push(...results);
    // Do not show normal indexes even there's no favorite selected yet.
    // https://stablehq.slack.com/archives/C03CQF6BFLJ/p1667314249461209
    // if (!this.total) {
    //   this.isFavoriteOnly = undefined;
    //   const { count, results } = await this.getIndexes();
    //   this.total = count;
    //   this.indexes.push(...results);
    // }
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  private getIndexes(): Promise<PaginationResponseV2<ClientIndex>> {
    return firstValueFrom(
      this.tradingCenterService.getIndexes(this.pageSize, this.pageNumber, null, this.isFavoriteOnly)
    ) as Promise<PaginationResponseV2<ClientIndex>>;
  }

  scrollRow(direction: number) {
    if (!this.rowElement) {
      this.rowElement = document.getElementById('favorite-index-row')!;
    }
    let scrollDistance = 0;
    const scrollInterval = setInterval(() => {
      this.rowElement.scrollLeft = 38 * direction + this.rowElement.scrollLeft;
      scrollDistance += 38;
      if (scrollDistance >= 380) {
        clearInterval(scrollInterval);
      }
    }, 20);
  }

  onScroll() {
    // Load new indexes
    if (this.indexes.length < this.total) {
      this.pageNumber += 1;
      this.loadPage();
    } else {
      // Fully loaded
    }
  }
}
