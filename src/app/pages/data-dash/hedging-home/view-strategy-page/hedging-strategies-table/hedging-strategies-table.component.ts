import { SelectionChange } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { HedgingStrategy } from '../../../../../core/models/hedging.model';
import { TableColumn } from '../../../../../ui-kit/table/table.model';

@Component({
  selector: 'dd-hedging-strategies-table',
  templateUrl: './hedging-strategies-table.component.html',
  styleUrls: ['./hedging-strategies-table.component.scss'],
})
export class HedgingStrategiesTableComponent implements OnInit {
  @Output() changeSelection: EventEmitter<SelectionChange<HedgingStrategy>> = new EventEmitter<
    SelectionChange<HedgingStrategy>
  >();
  @Input() dataSource: MatTableDataSource<HedgingStrategy>;

  columns: TableColumn[] = [
    {
      name: 'instrument',
      content: 'instrument',
      title: 'Instrument',
      width: 150,
    },
    {
      name: 'last_trading_day',
      content: 'last_trading_day',
      title: 'Settlement Day',
      width: 120,
    },
    {
      name: 'bid_ask',
      content: 'bid_ask',
      title: 'Bid - Ask',
      width: 150,
    },
    {
      name: 'effectiveness',
      content: 'effectiveness',
      title: 'Hedging Effectiveness',
      width: 150,
    },
    {
      name: 'quotes',
      content: 'quotes',
      title: 'Quotes',
      width: 100,
    },
    {
      name: 'contract_size',
      content: 'contract_size',
      title: 'Contract Size',
      width: 100,
    },
    {
      name: 'volume',
      content: 'volume',
      title: 'Volume',
      width: 100,
    },
    {
      name: 'exchange',
      content: 'exchange',
      title: 'Exchange',
      width: 100,
    },
    {
      name: 'time_of_update',
      content: 'time_of_update',
      title: 'Time of Update',
      pipe: 'date',
      width: 120,
    },
  ];
  displayedColumns = this.columns.map((x) => x.name);

  constructor() {}

  ngOnInit(): void {}
}
