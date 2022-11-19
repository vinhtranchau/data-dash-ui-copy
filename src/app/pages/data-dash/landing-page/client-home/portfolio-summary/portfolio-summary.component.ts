import { Component, OnInit, Pipe } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { AggregationSplit, portfolioSummaryTableRow } from '../../../../../core/models/client-portfolio.model';
import { TradingCenterService } from '../../../../../core/services/trading-center.service';
import { getDecimal } from '../../../../../core/utils/number.util';
import { TableColumn } from '../../../../../ui-kit/table/table.model';

@Component({
  selector: 'dd-portfolio-summary',
  templateUrl: './portfolio-summary.component.html',
  styleUrls: ['./portfolio-summary.component.scss'],
})
export class PortfolioSummaryComponent implements OnInit {
  dataSource = new MatTableDataSource<portfolioSummaryTableRow>([]);
  isLoading = true;

  columns: TableColumn[] = [
    {
      name: 'account',
      content: 'account',
      title: 'Account',
    },
    {
      name: 'value',
      content: 'value',
      title: 'Value',
    },
  ];
  displayedColumns = this.columns.map((x) => x.name);

  constructor(private tradingCenterService: TradingCenterService) {}

  ngOnInit(): void {}

  async loadData() {
    this.isLoading = true;
    const results = await firstValueFrom(this.tradingCenterService.getTradeRequestStatistics('live,settled'));
    let totalPremium = 0;
    let totalClaimsPaid = 0;
    let totalCount = 0;

    results.direction.map((agg: AggregationSplit) => {
      totalPremium += agg.total_premium;
      totalClaimsPaid += agg.total_claims_paid || 0;
      totalCount += agg.count;
    });

    this.dataSource.data = [
      {
        account: 'Total Premiums',
        value: '$' + getDecimal(totalPremium, 2),
      },
      {
        account: 'Total Claims',
        value: '$' + getDecimal(totalClaimsPaid, 2),
      },
      {
        account: 'Total Contracts',
        value: totalCount.toString(),
      },
    ];
    this.isLoading = false;
  }
}
