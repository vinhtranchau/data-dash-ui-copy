import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionChange } from '@angular/cdk/collections';
import { filter, firstValueFrom, map } from 'rxjs';

import { TradingCenterService } from '../../../../../core/services/trading-center.service';
import { ToastService } from '../../../../../ui-kit/toast/toast.service';
import { CorrelatedIndexesTableColumns, TradeIndexCorrelationPairExtended } from './correlated-indexes-table.config';
import { LoadDataEvent, TableAction, TableActionType } from '../../../../../ui-kit/table/table.model';
import { dataDashRoute } from '../../../../../core/routes/data-dash.route';
import { ContractType } from '../../../../../core/models/trading-center.model';

@Component({
  selector: 'dd-correlated-indexes-table',
  templateUrl: './correlated-indexes-table.component.html',
  styleUrls: ['./correlated-indexes-table.component.scss'],
})
export class CorrelatedIndexesTableComponent implements OnInit {
  @Input() indexId: string;
  @Input() contractType: ContractType;
  @Output() selectCorrelation: EventEmitter<TradeIndexCorrelationPairExtended> =
    new EventEmitter<TradeIndexCorrelationPairExtended>();

  columns = CorrelatedIndexesTableColumns;
  displayedColumns = this.columns.map((x) => x.name);

  dataSource = new MatTableDataSource<TradeIndexCorrelationPairExtended>([]);

  isLoading = true;

  constructor(private tradingCenter: TradingCenterService, private toast: ToastService, private router: Router) {}

  ngOnInit(): void {}

  async onLoadData(e: LoadDataEvent) {
    try {
      this.isLoading = true;
      const { results, count } = await firstValueFrom(
        this.tradingCenter.getCorrelatedIndexes(this.indexId, 1, 5, this.contractType).pipe(
          map((res) => ({
            ...res,
            results: [
              ...res.results
                .filter((x) => x.correlated_index.public_access_level < 6)
                .map((x) => ({
                  ...x,
                  correlated_index_id: x.correlated_index.id,
                  stable_index_code: x.correlated_index.stable_index_code,
                  index_provider: x.correlated_index.index_provider_id.name,
                  product: x.correlated_index.product_id.name,
                })),
            ],
          }))
        )
      );
      this.dataSource.data = results;
    } catch (e) {
      this.toast.error('Failed to load correlated indexes.');
    } finally {
      this.isLoading = false;
    }
  }

  action(obj: TableAction) {
    switch (obj.action) {
      case TableActionType.RouterLink:
        // Dummy route needed to refresh oninit as we are navigating to the same page
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate([
            '/' + dataDashRoute.root,
            dataDashRoute.tradingCenter,
            'trade',
            obj.id,
            this.contractType,
          ]);
        });
        break;
      default:
        break;
    }
  }

  onChangeSelection(e: SelectionChange<TradeIndexCorrelationPairExtended>) {
    const { added } = e;
    this.selectCorrelation.emit(added[0]);
  }
}
