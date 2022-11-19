import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { firstValueFrom } from 'rxjs';

import { QuantService } from '../../../../core/services/quant.service';
import { History } from '../../../../core/models/quant.model';
import { ToastService } from '../../../../ui-kit/toast/toast.service';
import { LoadDataEvent, TableColumn } from '../../../../ui-kit/table/table.model';

@Component({
  selector: 'dd-positions-table-panel',
  templateUrl: './positions-table-panel.component.html',
  styleUrls: ['./positions-table-panel.component.scss'],
})
export class PositionsTablePanelComponent implements OnInit {
  columns: TableColumn[] = [
    {
      name: 'instrument',
      content: 'instrument',
      title: 'Instrument',
    },
    {
      name: 'status',
      content: 'status',
      title: 'Status',
    },
    {
      name: 'date',
      content: 'date',
      title: 'Date',
      pipe: 'date',
    },
    {
      name: 'price',
      content: 'price',
      title: 'Average Price',
    },
    {
      name: 'side',
      content: 'side',
      title: 'Side',
    },
    {
      name: 'amount',
      content: 'amount',
      title: 'Amount',
    },
    {
      name: 'filled',
      content: 'filled',
      title: 'Filled',
    },
    {
      name: 'total',
      content: 'total',
      title: 'Total Price',
    },
    {
      name: 'pnl',
      content: 'pnl',
      title: 'PnL',
    },
    {
      name: 'exchange',
      content: 'exchange',
      title: 'Exchange',
    },
  ];

  displayedColumns = this.columns.map((x) => x.name);

  dataSource: MatTableDataSource<History> = new MatTableDataSource<History>([]);
  lastLoadDataEvent: LoadDataEvent;
  total = 0;

  isLoading = true;

  constructor(private quantService: QuantService, private toast: ToastService) {}

  ngOnInit(): void {}


  async loadData(e: LoadDataEvent) {
    try {
      this.isLoading = true;
      this.lastLoadDataEvent = e;
      const { pageSize, pageIndex, keyword } = e;
      const res = await firstValueFrom(this.quantService.getOrderTradeList(pageIndex + 1, pageSize));
      this.total = res.count;
      this.dataSource.data = res.results;
    } catch (e) {
      this.toast.error('Failed to load data.');
    } finally {
      this.isLoading = false;
    }
  }
}
