import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

import { firstValueFrom } from 'rxjs';

import { ContractType, StatusType, TradeRequest } from '../../../core/models/trading-center.model';
import { dataDashRoute } from '../../../core/routes/data-dash.route';
import { TradingCenterService } from '../../../core/services/trading-center.service';
import { addTimezone } from '../../../core/utils/dates.util';
import { LoadDataEvent, TableAction, TableActionType } from '../../../ui-kit/table/table.model';
import { ToastService } from '../../../ui-kit/toast/toast.service';
import { StickyColumns, portfolioTableColumns } from '../portfolio-table.config';

@Component({
  selector: 'dd-filtered-table',
  templateUrl: './filtered-table.component.html',
  styleUrls: ['./filtered-table.component.scss'],
})
export class FilteredTableComponent implements OnInit {
  @Input() tableHeight: string;
  @Input() displayedColumns: string[];
  @Input() statuses: StatusType[];
  @Input() sicFilter: string | null;
  @Input() hasSearch: boolean;

  contractType = ContractType;

  dataSource = new MatTableDataSource<TradeRequest>([]);

  stickyColumns = StickyColumns;
  columns = portfolioTableColumns;

  pageSize = 10;
  total = 0;
  isLoading = true;

  constructor(
    private tradingCenterService: TradingCenterService,
    private toast: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  async loadData(e: LoadDataEvent) {
    const { pageSize, pageIndex, keyword } = e;
    try {
      this.isLoading = true;
      let { results, count } = await firstValueFrom(
        this.tradingCenterService.getAllTradeRequest(
          pageSize,
          pageIndex + 1,
          keyword || '',
          this.statuses,
          this.sicFilter
        )
      );
      // Filter expired bids out (if any)
      results = results.filter((trade) => {
        return trade.bid == null || addTimezone(trade.bid.expiration_time) > new Date();
      });
      this.dataSource.data = results;
      this.total = count;
    } catch (e) {
      this.toast.error('Failed to load portfolio table.');
    } finally {
      this.isLoading = false;
    }
  }

  action(obj: TableAction) {
    switch (obj.action) {
      case TableActionType.RouterLink:
        this.router.navigate([
          '/' + dataDashRoute.root,
          dataDashRoute.tradingCenter,
          'trade',
          obj.id,
          this.contractType.Individual,
        ]);
        break;
      case TableActionType.Bolt:
        this.router.navigate(['/' + dataDashRoute.root, dataDashRoute.tradingCenter, 'view', obj.id]);
        break;
      default:
        break;
    }
  }
}
