import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';

import { RollingDealService } from '../../../../../core/services/rolling-deal.service';
import { ToastService } from '../../../../../ui-kit/toast/toast.service';
import { QuoteAnalysis, QuoteAnalysisCustom } from '../../../../../core/models/rolling-deal.model';
import { TableAction, TableActionType, TableColumn } from '../../../../../ui-kit/table/table.model';
import { PermissionType } from '../../../../../core/models/permission.model';
import { RollingDealPortfolio, RollingDealStatus } from '../../../../../core/models/trading-center.model';
import {
  clientQuoteAnalysisTableColumn,
  dsQuoteAnalysisTableColumns,
  fixationTableColumns,
  uwQuoteAnalysisTableColumns,
} from './quote-analysis-table.config';
import { PageType, Permission } from '../utils/price-analysis.util';
import { UpdateRollingDealDialogComponent } from '../update-rolling-deal-dialog/update-rolling-deal-dialog.component';

@Component({
  selector: 'dd-quote-analysis-table',
  templateUrl: './quote-analysis-table.component.html',
  styleUrls: ['./quote-analysis-table.component.scss'],
})
export class QuoteAnalysisTableComponent implements OnInit {
  @Input() deal: RollingDealPortfolio;
  @Input() permission: Permission;

  @Output() updateQuoteAnalysis: EventEmitter<QuoteAnalysisCustom> = new EventEmitter<QuoteAnalysisCustom>();

  columns: TableColumn[] = [];
  displayColumns: string[] = [];
  datasource: MatTableDataSource<QuoteAnalysis> = new MatTableDataSource<QuoteAnalysis>([]);
  TableType = PermissionType.UnderWriterAccess;
  isLoading = false;
  fixationTableColumns = fixationTableColumns;
  fixationTableDisplayColumns = fixationTableColumns.map((x) => x.name);

  // Before the soft launch, we are dealing with only one quote
  private initialQuoteAnalysis: QuoteAnalysis;

  constructor(
    private readonly rollingDealService: RollingDealService,
    private readonly route: ActivatedRoute,
    private readonly toast: ToastService,
    private readonly dialog: MatDialog,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const { id } = this.route.snapshot.params;
    this.loadInitialAnalysisQuote(id).then();

    this.buildTableColumns();
  }

  action(obj: TableAction) {
    if (obj.action === TableActionType.Edit) {
      if (
        this.deal.status === RollingDealStatus.IndicativeRequest ||
        this.deal.status === RollingDealStatus.FirmRequest ||
        this.deal.status === RollingDealStatus.IndicativeReprice ||
        this.deal.status === RollingDealStatus.FirmReprice
      ) {
        this.dialog
          .open(UpdateRollingDealDialogComponent, {
            data: { quote: this.initialQuoteAnalysis, permission: this.permission },
            width: '450px',
            closeOnNavigation: true,
            disableClose: true,
            autoFocus: false,
          })
          .afterClosed()
          .subscribe((res) => {
            if (res) {
              // Need to update the table with the value, but it is just temporary, saved only on the UI.
              this.initialQuoteAnalysis = { ...this.initialQuoteAnalysis, ...res, fixations: this.deal.fixations };
              if (this.permission.type === PageType.DS) {
                this.initialQuoteAnalysis.final_premium =
                  this.initialQuoteAnalysis.algo_premium_ratio + this.initialQuoteAnalysis.ds_premium_adjustment;
              }
              this.datasource.data = [this.initialQuoteAnalysis];
              this.updateQuoteAnalysis.emit(res);
            }
          });
      } else {
        this.toast.info('You can not update the quote until customer request reprice.');
      }
    }
  }

  async loadInitialAnalysisQuote(id: string) {
    this.isLoading = true;
    try {
      this.initialQuoteAnalysis = await firstValueFrom(this.rollingDealService.getQuoteAnalysis(id));
      this.initialQuoteAnalysis = { ...this.initialQuoteAnalysis, fixations: this.deal.fixations };
      // When it is UW page, Algo = Algo + DS inputted from the DS page
      if (this.permission.type === PageType.UW) {
        const { algo_premium_ratio, ds_premium_adjustment } = this.initialQuoteAnalysis;
        this.initialQuoteAnalysis.algo_premium_ratio = Number(algo_premium_ratio) + Number(ds_premium_adjustment);
      }
      this.initialQuoteAnalysis.algo_premium_ratio = Number(
        Number(this.initialQuoteAnalysis.algo_premium_ratio).toFixed(4)
      );
      this.initialQuoteAnalysis.uw_premium_surcharge = Number(
        Number(this.initialQuoteAnalysis.uw_premium_surcharge).toFixed(4)
      );
      this.initialQuoteAnalysis = {
        ...this.initialQuoteAnalysis,
        fixations: this.deal.fixations,
      };
      this.datasource.data = [this.initialQuoteAnalysis];
    } catch (e) {
      this.toast.error('Failed to load quote analysis');
    } finally {
      this.isLoading = false;
    }
  }

  private buildTableColumns() {
    const { type } = this.permission;

    if (type === PageType.DS) {
      this.columns = dsQuoteAnalysisTableColumns;
    } else if (type === PageType.UW) {
      this.columns = uwQuoteAnalysisTableColumns;
    } else if (type === PageType.Client) {
      this.columns = clientQuoteAnalysisTableColumn;
    }
    this.displayColumns = this.columns.map((x) => x.name);
    this.cdr.detectChanges();
  }
}
