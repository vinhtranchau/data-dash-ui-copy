import { Component, Input, OnInit } from '@angular/core';

import { OrderBookInfo } from '../../../../../core/models/quant.model';

@Component({
  selector: 'dd-status-bar',
  templateUrl: './status-bar.component.html',
  styleUrls: ['./status-bar.component.scss'],
})
export class StatusBarComponent implements OnInit {
  @Input() info: OrderBookInfo;

  total = 0;
  available = 0;
  pnl = 0;
  margin = 0;

  constructor() {}

  ngOnInit(): void {
    const { margin, available_usd, pnl } = this.info;
    this.available = available_usd;
    this.pnl = pnl;
    this.margin = margin;

    this.total = this.available + this.pnl + this.margin;
  }
}
