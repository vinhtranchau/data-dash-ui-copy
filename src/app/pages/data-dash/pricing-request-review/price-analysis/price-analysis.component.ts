import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { RollingDealService } from '../../../../core/services/rolling-deal.service';
import { ToastService } from '../../../../ui-kit/toast/toast.service';
import { RollingDealPortfolio } from '../../../../core/models/trading-center.model';
import { QuoteAnalysisCustom, QuotePublishingCheck } from '../../../../core/models/rolling-deal.model';
import { PermissionType } from '../../../../core/models/permission.model';
import { PageType, Permission } from './utils/price-analysis.util';
import { QuoteAnalysisTableComponent } from './quote-analysis-table/quote-analysis-table.component';

@Component({
  selector: 'dd-price-analysis',
  templateUrl: './price-analysis.component.html',
  styleUrls: ['./price-analysis.component.scss'],
})
export class PriceAnalysisComponent implements OnInit {
  @ViewChild(QuoteAnalysisTableComponent) table: QuoteAnalysisTableComponent;

  PageType = PageType;
  loader = {
    isLoading: false,
    message: 'Loading...',
  };
  permission: Permission = {
    type: PageType.DS,
  };
  deal: RollingDealPortfolio;
  id: string;

  quotePublishingCheck: QuotePublishingCheck = {
    is_ds_check_passed: false,
    is_sales_check_passed: false,
    is_underwriter_check_passed: false,
  };

  private quoteAnalysis: QuoteAnalysisCustom;

  constructor(
    private readonly rollingDealService: RollingDealService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly toast: ToastService
  ) {}

  ngOnInit(): void {
    this.permission = this.checkPermission();
    // Load deal detail
    const { id } = this.route.snapshot.params;
    this.id = id;
    this.loadRollingDeal().then();
  }

  onDownloadDealData() {
    this.rollingDealService.downloadDealData(this.deal.id).subscribe();
  }

  async onUpdateQuoteAnalysis(quote: QuoteAnalysisCustom) {
    this.quoteAnalysis = quote;
    try {
      this.loader.isLoading = true;
      this.loader.message = 'Confirming quote...';
      await firstValueFrom(this.updateRollingDeal());
      this.table.loadInitialAnalysisQuote(this.id);
    } catch (e) {
      this.toast.error('Failed to update quote analysis...');
    } finally {
      this.loader.isLoading = false;
    }
  }

  async onSendQuoteToUW() {
    try {
      this.loader.isLoading = true;
      this.loader.message = 'Sending quote to customer...';
      if (this.quoteAnalysis) {
        // When there's unsaved quote analysis change exists, save this by calling the update rolling deal api.
        await firstValueFrom(this.updateRollingDeal());
      }
      await firstValueFrom(this.rollingDealService.markDealDSPassed(this.deal.id));
      this.router.navigate(['..'], { relativeTo: this.route }).then();
    } catch (e) {
      this.toast.error('Failed to sending quote to the UW.');
    } finally {
      this.loader.isLoading = false;
    }
  }

  async onConfirmQuote() {
    try {
      this.loader.isLoading = true;
      this.loader.message = 'Confirming quote...';
      await firstValueFrom(this.updateRollingDeal());
      // Manually set the sales and underwriter check as true after the confirmation
      this.deal.is_sales_check_passed = true;
      this.deal.is_underwriter_check_passed = true;
    } catch (e) {
      this.toast.error('Failed to confirm the quote.');
    } finally {
      this.loader.isLoading = false;
    }
  }

  async onSendToCustomer() {
    try {
      this.loader.isLoading = true;
      this.loader.message = 'Sending quote to customer...';
      await firstValueFrom(this.rollingDealService.sendToCustomer(this.deal.id));
      this.router.navigate(['..'], { relativeTo: this.route });
      this.toast.success('Successfully sent the quote to customer.');
    } catch (e) {
      this.toast.error('Failed to confirm the quote.');
    } finally {
      this.loader.isLoading = false;
    }
  }

  async loadRollingDeal() {
    try {
      this.loader.isLoading = true;
      this.deal = await firstValueFrom(this.rollingDealService.getRollingDealById(this.id));
    } catch (e) {
      this.toast.error('Failed to load quote details.');
    } finally {
      this.loader.isLoading = false;
    }
  }

  private updateRollingDeal() {
    const payload = { ...this.quoteAnalysis, ...this.quotePublishingCheck };
    return this.rollingDealService.updateRollingDeal(this.deal.id, payload);
  }

  private checkPermission(): Permission {
    const { type } = this.route.snapshot.data;
    if (type === PermissionType.UnderWriterAccess) {
      // UW page
      return { type: PageType.UW };
    } else if (type === PermissionType.DataCenterAccess) {
      // DS page
      return { type: PageType.DS };
    } else if (type === PermissionType.TradingCenter) {
      // Non reachable.
      return { type: PageType.Client };
    } else {
      return { type: PageType.DS };
    }
  }
}
