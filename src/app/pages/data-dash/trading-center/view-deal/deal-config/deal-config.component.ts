import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { StatusType, TradeRequest } from '../../../../../core/models/trading-center.model';
import { TradingCenterService } from '../../../../../core/services/trading-center.service';
import { CancelTradeComponent } from '../cancel-trade/cancel-trade.component';

@Component({
  selector: 'dd-deal-config',
  templateUrl: './deal-config.component.html',
  styleUrls: ['./deal-config.component.scss'],
})
export class DealConfigComponent implements OnInit {
  @Input() tradeRequest: TradeRequest;

  currencyAndUnit: string;
  statusType = StatusType;

  constructor(private tradingCenterService: TradingCenterService, private dialog: MatDialog) {}

  ngOnInit(): void {}

  async cancelTrade() {
    await firstValueFrom(this.tradingCenterService.deleteTradeRequest(this.tradeRequest.id));
    this.dialog.open(CancelTradeComponent, {
      closeOnNavigation: true,
      disableClose: true,
      panelClass: 'rootModal',
      autoFocus: false,
    });
  }
}
