import { Component, Input, OnInit } from '@angular/core';
import { StatusType } from '../../core/models/trading-center.model';
import { BidColumns, LiveTradeColumns, WatchColumns } from './portfolio-table.config';

@Component({
  selector: 'dd-portfolio-table',
  templateUrl: './portfolio-table.component.html',
  styleUrls: ['./portfolio-table.component.scss']
})
export class PortfolioTableComponent implements OnInit {
  @Input() tableHeight: string;
  @Input() sicFilter: string | null = null;
  @Input() hasSearch: boolean = true;

  liveTradeColumns = LiveTradeColumns;
  liveTradeStatuses = [
    StatusType.Purchase,
    StatusType.Live,
    StatusType.Settled,
  ];

  bidColumns = BidColumns;
  bidStatuses = [
    StatusType.Bid
  ]

  watchColumns = WatchColumns;
  watchStatuses = [
    StatusType.Watch
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
