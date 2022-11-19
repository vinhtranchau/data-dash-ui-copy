import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { firstValueFrom, map } from 'rxjs';

import { LoadDataEvent, TableColumn } from '../../../ui-kit/table/table.model';
import { ToastService } from '../../../ui-kit/toast/toast.service';
import { DataTablePageComponent } from '../../../ui-kit/table/data-table-page/data-table-page.component';
import { TradingCenterService } from '../../../core/services/trading-center.service';
import { enumToLabel, enumToOptions } from '../../../core/utils/enum.util';
import { PermissionType } from '../../../core/models/permission.model';
import { pricingRequestReviewTableColumns } from './pricing-request-review-table.config';
import { RollingDealPortfolio, RollingDealStatus } from '../../../core/models/trading-center.model';

@Component({
  selector: 'dd-pricing-request-review',
  templateUrl: './pricing-request-review.component.html',
  styleUrls: ['./pricing-request-review.component.scss'],
})
export class PricingRequestReviewComponent implements OnInit {
  @ViewChild('priceAnalysisButtonCell') priceAnalysisButtonCell: TemplateRef<any>;
  @ViewChild(DataTablePageComponent) table: DataTablePageComponent<any>;

  // Do not initialize the table columns to add template column dynamically
  columns: TableColumn[] = [];
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<RollingDealPortfolio>([]);

  pageSize = 12;
  total = 0;
  isLoading = false;

  isUW = false;

  rollingDealStatusOptions = enumToOptions(RollingDealStatus);
  statusFilter: FormGroup = this.fb.group({
    status: null,
  });

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly tradingCenterService: TradingCenterService,
    private readonly toast: ToastService,
    private readonly route: ActivatedRoute,
    private readonly fb: FormBuilder
  ) {
    const { type } = this.route.snapshot.data;
    this.isUW = type === PermissionType.UnderWriterAccess;
  }

  ngOnInit(): void {
    this.statusFilter.valueChanges.subscribe(() => {
      // Reset page when status filter changes
      this.table.changePage({ pageSize: this.pageSize, pageIndex: 0, length: this.total });
    });
  }

  ngAfterViewInit(): void {
    // Add template column to the table
    this.columns = [
      ...pricingRequestReviewTableColumns,
      { name: 'link', template: this.priceAnalysisButtonCell, content: 'link', title: '' },
    ];
    this.displayedColumns = this.columns.map((x) => x.name);
    this.cdr.detectChanges();
  }

  async loadData(e: LoadDataEvent) {
    const { pageSize, pageIndex } = e;
    const { status } = this.statusFilter.value;
    try {
      this.isLoading = true;
      const { results, count } = await firstValueFrom(
        this.getAllRollingDealRequests(pageSize, pageIndex, status).pipe(
          map((res) => {
            res.results = res.results.map((x) => ({
              ...x,
              name: x.created_by.name,
              company_name: x.created_by.company_name,
              sic: x.index.stable_index_code,
              specification: x.index.specification,
              statusText: enumToLabel(x.status),
            }));
            return res;
          })
        )
      );
      this.dataSource.data = results;
      this.total = count;
    } catch (e) {
      this.toast.error('Failed to load portfolio table.');
    } finally {
      this.isLoading = false;
    }
  }

  private getAllRollingDealRequests(pageSize: number, pageIndex: number, status: RollingDealStatus | null) {
    if (this.isUW) {
      return this.tradingCenterService.getUWAllRollingDealRequests(pageSize, pageIndex + 1, status);
    } else {
      // No need to apply status filter to DS page, because there will be only 2 statuses - Indicative Request and Firm Request
      return this.tradingCenterService.getDSRollingDealRequests(pageSize, pageIndex + 1);
    }
  }
}
