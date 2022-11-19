import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { ClassHierarchy } from '../../../../core/models/hierarchy.model';
import { ClientIndex, TradeIndexType } from '../../../../core/models/trading-center.model';
import { TradingCenterService } from '../../../../core/services/trading-center.service';
import { ToastService } from '../../../../ui-kit/toast/toast.service';

@Component({
  selector: 'dd-product-row',
  templateUrl: './product-row.component.html',
  styleUrls: ['./product-row.component.scss'],
})
export class ProductRowComponent implements OnInit, AfterViewInit {
  @Input() classHierarchy: ClassHierarchy;
  @Input() tradeIndexType: TradeIndexType

  isLoading = false;
  indexes: ClientIndex[];
  allIndexes: ClientIndex[];
  rowElement: HTMLElement;
  hasScrollButtons: boolean = false;

  TradeIndexType = TradeIndexType;

  constructor(private tradingCenterService: TradingCenterService, private toast: ToastService) {}

  ngOnInit() {
    this.loadPage().then();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.rowElement = document.getElementById('class-row-' + this.classHierarchy.id)!;
    }, 500);
  }

  async loadPage() {
    try {
      this.isLoading = true;
      const results = (await firstValueFrom(
        this.tradingCenterService.getIndexes(null, null, this.classHierarchy.id)
      )) as ClientIndex[];
      this.allIndexes = results;
      this.filterIndexes();
      if (this.indexes.length > (window.innerWidth - 310) / 260) {
        this.hasScrollButtons = true;
      }
    } catch (e) {
      this.toast.error(`Failed to load indexes for class - "${this.classHierarchy.name}"`);
    } finally {
      this.isLoading = false;
    }
  }

  scrollRow(direction: number) {
    let scrollDistance = 0;
    if (!this.rowElement) {
      this.rowElement = document.getElementById('class-row-' + this.classHierarchy.id)!;
    }
    const scrollInterval = setInterval(() => {
      this.rowElement.scrollLeft = 26 * direction + this.rowElement.scrollLeft;
      scrollDistance += 26;
      if (scrollDistance >= 260) {
        clearInterval(scrollInterval);
      }
    }, 20);
  }

  private filterIndexes(): void {
    if (this.allIndexes && this.allIndexes.length) {
      this.indexes = this.allIndexes.filter((index) => {
        switch (this.tradeIndexType) {
          case TradeIndexType.All:
            return true;
          case TradeIndexType.HedgingBook:
            return index.in_hedging_book;
          case TradeIndexType.RollingDeal:
            return index.is_rolling_deal;
          default:
            return false;
        }
      });
    }
  }
}
