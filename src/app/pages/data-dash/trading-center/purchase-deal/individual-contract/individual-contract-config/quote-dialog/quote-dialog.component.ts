import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { dataDashRoute } from '../../../../../../../core/routes/data-dash.route';
import { TradingCenterService } from '../../../../../../../core/services/trading-center.service';

@Component({
  selector: 'dd-quote-dialog',
  templateUrl: './quote-dialog.component.html',
  styleUrls: ['./quote-dialog.component.scss'],
})
export class QuoteDialogComponent implements OnInit {
  interval: ReturnType<typeof setInterval>;
  timer: number = 0;
  hasTimeout = false;
  dataDashRoute = dataDashRoute;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { tradeId: string },
    private tradingCenterService: TradingCenterService,
    private matDialog: MatDialogRef<QuoteDialogComponent>
  ) {}

  ngOnInit(): void {
    this.interval = setInterval(() => {
      this.checkQuote();
    }, 3000);
  }

  async checkQuote() {
    this.timer += 3000;
    const result = await firstValueFrom(this.tradingCenterService.getTradeRequest(this.data.tradeId));
    if (result.premium) {
      clearInterval(this.interval);
      this.matDialog.close();
    }
    if (this.timer > 60000) {
      clearInterval(this.interval);
      this.hasTimeout = true;
    }
  }

  close() {
    this.matDialog.close();
  }
}
