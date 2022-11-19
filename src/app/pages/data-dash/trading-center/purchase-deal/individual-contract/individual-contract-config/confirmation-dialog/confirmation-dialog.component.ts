import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { OptionTypes } from '../../../../../../../core/models/empirical-modelling.model';
import { bidRequest, ClientIndex, StatusType } from '../../../../../../../core/models/trading-center.model';
import { TradingCenterService } from '../../../../../../../core/services/trading-center.service';
import { getCoverageEnd, getCoverageStart, addTimezone } from '../../../../../../../core/utils/dates.util';
import { ToastService } from '../../../../../../../ui-kit/toast/toast.service';

@Component({
  selector: 'dd-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss'],
})
export class ConfirmationDialogComponent implements OnInit, AfterViewInit {
  startingDate: Date;
  endingDate: Date;
  expiryDate: Date;

  checkBoxTnC: boolean = false;
  checkBoxContractSpecs: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      tradeId: string;
      status: StatusType;
      indexDetails: ClientIndex;
      strike: number;
      limit: number;
      quantity: number;
      direction: OptionTypes;
      start_in: number;
      end_in: number;
      pricePerUnit: number;
      is_partial_execution_enabled: boolean;
      expiration_time: Date;
    },
    private tradingCenterService: TradingCenterService,
    private dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    private toast: ToastService,
  ) {}

  ngOnInit(): void {
    this.startingDate = addTimezone(getCoverageStart(this.data.start_in));
    this.endingDate = addTimezone(getCoverageEnd(this.data.end_in));
    this.expiryDate = addTimezone(this.data.expiration_time);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      document.getElementById('scroll-to')!.scrollIntoView({
        behavior: 'smooth',
      });
    }, 500);
  }

  async completeTrade() {
    try {
      if (this.data.status === StatusType.Purchase) {
        await firstValueFrom(
          this.tradingCenterService.finishTradeRequest(this.data.tradeId, this.data.status, this.data.quantity)
        );
      } else if (this.data.status === StatusType.Bid) {
        const bidPayload: bidRequest = {
          is_partial_execution_enabled: this.data.is_partial_execution_enabled,
          price: this.data.pricePerUnit,
          expiration_time: this.expiryDate,
        };
        await firstValueFrom(
          this.tradingCenterService.finishTradeRequest(
            this.data.tradeId,
            this.data.status,
            this.data.quantity,
            bidPayload
          )
        );
      }
    } catch (e) {
      this.toast.error('Something went wrong, please refresh the page and try again or contact the admins.')
    }
    this.dialogRef.close(true);
  }
}
