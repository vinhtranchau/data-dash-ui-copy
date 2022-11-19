import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';

import { RollingDealPortfolio, RollingDealStatus } from '../../../../../core/models/trading-center.model';
import { RollingDealService } from '../../../../../core/services/rolling-deal.service';
import { ToastService } from '../../../../../ui-kit/toast/toast.service';
import { RepriceConfirmDialogComponent } from '../reprice-confirm-dialog/reprice-confirm-dialog.component';

@Component({
  selector: 'dd-quote-review-form',
  templateUrl: './quote-review-form.component.html',
  styleUrls: ['./quote-review-form.component.scss'],
})
export class QuoteReviewFormComponent implements OnInit {
  @Input() deal: RollingDealPortfolio;

  RollingDealStatus = RollingDealStatus;

  isLoading = false;
  isAccepted = false;
  isPending = false;
  acceptButtonLabel = '';

  constructor(
    private readonly rollingDealService: RollingDealService,
    private readonly toast: ToastService,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.checkStatus();
  }

  async requestRepricing() {
    const reject_reason = await this.confirmReprice();
    if (!reject_reason) {
      return;
    }
    try {
      this.isLoading = true;
      if (this.deal.status === RollingDealStatus.IndicativeReceived) {
        await firstValueFrom(this.rollingDealService.repriceIndicativeDeal(this.deal.id, reject_reason));
        this.deal.status = RollingDealStatus.IndicativeReprice;
      } else if (this.deal.status === RollingDealStatus.FirmReceived) {
        await firstValueFrom(this.rollingDealService.rejectFirmDeal(this.deal.id, reject_reason));
        this.deal.status = RollingDealStatus.FirmReprice;
      }
      this.checkStatus();
      this.toast.info('Someone from our team will contact you shortly.');
    } catch (e) {
      this.toast.error('Failed to request firm quote.');
    } finally {
      this.isLoading = false;
    }
  }

  async acceptQuote() {
    try {
      this.isLoading = true;
      if (this.deal.status === RollingDealStatus.IndicativeReceived) {
        await firstValueFrom(this.rollingDealService.initiateFirmDeal(this.deal.id));
        this.deal.status = RollingDealStatus.FirmRequest;
        this.toast.info(
          'Someone from our team will contact you to complete compliance requirements prior to receiving a firm quote'
        );
      } else if (this.deal.status === RollingDealStatus.FirmReceived) {
        await firstValueFrom(this.rollingDealService.acceptFirmDeal(this.deal.id));
        this.deal.status = RollingDealStatus.FirmAccepted;
        this.toast.info('Your deal is live and will be executed.');
      }
      this.checkStatus();
    } catch (e) {
      this.toast.error('Failed to accept firm quote.');
    } finally {
      this.isLoading = false;
    }
  }

  private confirmReprice(): Promise<string | null> {
    return new Promise((resolve) => {
      this.dialog
        .open(RepriceConfirmDialogComponent, {
          closeOnNavigation: true,
          disableClose: false,
          panelClass: 'rootModal',
          autoFocus: false,
          width: '400px',
        })
        .afterClosed()
        .subscribe((res: { reject_reason: string }) => {
          if (res) {
            resolve(res.reject_reason);
          } else {
            resolve(null);
          }
        });
    });
  }

  private checkStatus() {
    const { status } = this.deal;
    this.isAccepted = Boolean(
      [
        RollingDealStatus.FirmAccepted,
        RollingDealStatus.PendingTradeExecution,
        RollingDealStatus.FirmExecuted,
        RollingDealStatus.Expired,
      ].find((x) => x === status)
    );
    this.isPending = Boolean(
      [RollingDealStatus.FirmReceived, RollingDealStatus.IndicativeReceived].find((x) => x === status)
    );
    if (!this.isAccepted) {
      this.acceptButtonLabel = Boolean(
        [RollingDealStatus.FirmRequest, RollingDealStatus.FirmReceived].find((x) => x === status)
      )
        ? 'Accept Quote'
        : 'Initiate Firm Quote';
    }
  }
}
