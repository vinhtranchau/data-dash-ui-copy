import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { ContractType, RollingDealPortfolio } from '../../../core/models/trading-center.model';
import { dataDashRoute } from '../../../core/routes/data-dash.route';
import { standaloneModalRoute } from '../../../core/routes/standalone-modal.route';
import { CommonService } from '../../../core/services/common.service';
import { TradingCenterService } from '../../../core/services/trading-center.service';
import { relativePath } from '../../../core/utils/route.util';
import { LoadDataEvent, TableAction, TableActionType, TableColumn } from '../../../ui-kit/table/table.model';
import { ToastService } from '../../../ui-kit/toast/toast.service';
import { fixationTableColumns, rollingDealsTableColumns, StickyColumns } from './rolling-deals.config';

@Component({
  selector: 'dd-rolling-deals',
  templateUrl: './rolling-deals.component.html',
  styleUrls: ['./rolling-deals.component.scss'],
})
export class RollingDealsComponent implements OnInit, AfterViewInit {
  @Input() tableHeight: string;
  @Input() sicFilter: string | null;
  @Input() hasSearch: boolean;

  @ViewChild('viewQuoteCellTemplate') viewQuoteCellTemplate: TemplateRef<any>;
  @ViewChild('actionCellTemplate') actionCellTemplate: TemplateRef<any>;

  dataSource = new MatTableDataSource<RollingDealPortfolio>([]);
  stickyColumns = StickyColumns;
  columns: TableColumn[] = [];
  displayedColumns: string[] = [];
  fixationTableColumns = fixationTableColumns;
  fixationTableDisplayColumns = fixationTableColumns.map((x) => x.name);

  pageSize = 10;
  total = 0;
  isLoading = true;

  dataDashRoute = dataDashRoute;

  constructor(
    private readonly tradingCenterService: TradingCenterService,
    private readonly toast: ToastService,
    private readonly router: Router,
    private readonly commonService: CommonService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.columns = [
      ...rollingDealsTableColumns,
      { name: 'review_rolling_deal', template: this.actionCellTemplate, content: '', title: '' },
    ];
    // HOTFIX: Because of the redraw table columns after the after view init of the parent component, we may need to send
    //  the expand column again to here.
    this.displayedColumns = ['expand', ...this.columns.map((x) => x.name)];
    this.cdr.detectChanges();
  }

  async loadData(e: LoadDataEvent) {
    const { pageSize, pageIndex, keyword } = e;
    try {
      this.isLoading = true;
      const { results, count } = await firstValueFrom(
        this.tradingCenterService.getAllRollingDealRequest(pageSize, pageIndex + 1, keyword || '', this.sicFilter)
      );
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
          ContractType.RollingDeal,
        ]);
        break;
      case TableActionType.Bolt:
        this.commonService.openStandaloneModal(
          relativePath([standaloneModalRoute.root, standaloneModalRoute.rollingDealAction, obj.id])
        );
        break;
      default:
        break;
    }
  }

  openQuoteFile(url: string): void {
    window.open(url, '_blank');
  }
}
