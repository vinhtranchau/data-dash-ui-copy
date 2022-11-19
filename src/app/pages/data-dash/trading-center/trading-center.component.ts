import { Component, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormGroup } from '@angular/forms';
import { debounceTime, firstValueFrom } from 'rxjs';

import { ClassHierarchy, HierarchyType } from '../../../core/models/hierarchy.model';
import { TradeIndexType } from '../../../core/models/trading-center.model';
import { HierarchyService } from '../../../core/services/hierarchy.service';
import { ToastService } from '../../../ui-kit/toast/toast.service';

@Component({
  selector: 'dd-trading-center',
  templateUrl: './trading-center.component.html',
  styleUrls: ['./trading-center.component.scss'],
})
export class TradingCenterComponent implements OnInit {
  isLoading = false;
  classes: ClassHierarchy[] = [];

  form: UntypedFormGroup = this.fb.group({
    searchTerm: [''],
    includeHedgingBook: [true],
    includeRollingDeals: [true],
  });

  // Each row height is 213px and top space is 150px. To calculate count of rows below code should be executed.
  pageSize = Math.ceil((window.innerHeight - 150) / 213) + 2;

  tradeIndexType = TradeIndexType.All;

  TradeIndexType = TradeIndexType;

  private page = 1;
  private total = 0;

  constructor(private hierarchyService: HierarchyService, private fb: FormBuilder, private toast: ToastService) {}

  ngOnInit() {
    this.loadPage().then();
    this.form
      .get('searchTerm')
      ?.valueChanges.pipe(debounceTime(400))
      .subscribe(() => {
        this.page = 1;
        this.classes = [];
        this.total = 0;
        this.loadPage().then();
      });
    this.form.get('includeHedgingBook')?.valueChanges.subscribe(() => {
      this.filterTradeIndexType();
    });
    this.form.get('includeRollingDeals')?.valueChanges.subscribe(() => {
      this.filterTradeIndexType();
    });
  }

  filterTradeIndexType() {
    const includeHedgingBook = this.form.get('includeHedgingBook')?.value;
    const includeRollingDeals = this.form.get('includeRollingDeals')?.value;
    if (includeHedgingBook && includeRollingDeals) {
      this.tradeIndexType = TradeIndexType.All;
    } else if (includeHedgingBook) {
      this.tradeIndexType = TradeIndexType.HedgingBook;
    } else if (includeRollingDeals) {
      this.tradeIndexType = TradeIndexType.RollingDeal;
    } else {
      this.tradeIndexType = TradeIndexType.None;
    }

    this.page = 1;
    this.classes = [];
    this.total = 0;
    if (this.tradeIndexType != TradeIndexType.None) {
      this.loadPage().then();
    }
  }

  onScroll() {
    // Load new classes
    if (this.classes.length < this.total) {
      this.page += 1;
      this.loadPage();
    } else {
      // Fully loaded
    }
  }

  private async loadPage(): Promise<void> {
    try {
      this.isLoading = true;
      const searchTerm = this.form.value.searchTerm;

      const { results, count } = await firstValueFrom(
        this.hierarchyService.getHierarchies<ClassHierarchy>(
          HierarchyType.Class,
          this.pageSize,
          this.page,
          searchTerm,
          this.tradeIndexType,
          true
        )
      );
      this.total = count;
      this.classes = [...this.classes, ...results];
    } catch (e) {
      this.toast.error('Failed to load available classes');
    } finally {
      this.isLoading = false;
    }
  }
}
