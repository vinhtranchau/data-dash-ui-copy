import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { QuantService } from '../../../../core/services/quant.service';
import { History, Side } from '../../../../core/models/quant.model';
import { ToastService } from '../../../../ui-kit/toast/toast.service';

@Component({
  selector: 'dd-trade-history-panel',
  templateUrl: './trade-history-panel.component.html',
  styleUrls: ['./trade-history-panel.component.scss'],
})
export class TradeHistoryPanelComponent implements OnInit {
  Side = Side;
  isLoading = false;
  history: History[] = [];

  constructor(private quantService: QuantService, private toast: ToastService) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  async loadHistory() {
    try {
      this.isLoading = true;
      const res = await firstValueFrom(this.quantService.getOrderTradeList());
      this.history = res.results;
    } catch (e) {
      this.toast.error('Failed to load trading history.');
    } finally {
      this.isLoading = false;
    }
  }
}
