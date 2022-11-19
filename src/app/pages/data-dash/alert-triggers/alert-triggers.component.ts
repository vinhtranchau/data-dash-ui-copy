import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { debounceTime, firstValueFrom } from 'rxjs';

import { AlertTriggerService } from '../../../core/services/alert-trigger.service';
import { Alert, AlertGrouped } from '../../../core/models/alert-trigger.model';
import { groupByDate } from '../../../core/utils/alert-trigger.util';
import { ToastService } from '../../../ui-kit/toast/toast.service';
import { AlertDetailComponent } from './alert-detail/alert-detail.component';
import { dataDashRoute } from '../../../core/routes/data-dash.route';
import { PaginationResponseV2 } from '../../../core/models/common.model';
import { downloadXLS, XLSContentDataType } from '../../../core/utils/download-xls.util';
import { userRoute } from '../../../core/routes/user.route';

@Component({
  selector: 'dd-alert-triggers',
  templateUrl: './alert-triggers.component.html',
  styleUrls: ['./alert-triggers.component.scss'],
})
export class AlertTriggersComponent implements OnInit {
  alerts: Alert[] = [];
  dataDashRoute = dataDashRoute;
  userRoute = userRoute;

  isLoading = false;
  alertsByDate: AlertGrouped = {};
  alertDates: string[];

  form: UntypedFormGroup = this.fb.group({
    searchTerm: [''],
    favoriteIndexOnly: [false],
  });

  private page = 1;
  private pageSize = Math.ceil((window.innerHeight - 230) / 72) + 2;
  private total = 0;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private alertTriggerService: AlertTriggerService,
    private toast: ToastService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    const { id } = this.route.snapshot.params;
    if (id) {
      this.showAlertDetails(id);
    }
    this.loadAlerts().then();
    this.form.valueChanges.pipe(debounceTime(400)).subscribe(() => {
      this.page = 1;
      this.alerts = [];
      this.alertsByDate = {};
      this.loadAlerts().then();
    });
  }

  onScroll() {
    // Load new alerts
    if (this.page * this.pageSize < this.total) {
      this.page += 1;
      this.loadAlerts().then();
    } else {
      // Fully loaded
    }
  }

  showAlertDetails(alertId: string): void {
    this.location.replaceState(`${this.dataDashRoute.root}/${this.dataDashRoute.indexAlerts}/${alertId}`);
    this.dialog
      .open(AlertDetailComponent, {
        width: '700px',
        data: alertId,
        panelClass: 'rootModal',
        autoFocus: false,
      })
      .afterClosed()
      .subscribe(() => this.location.replaceState(`${this.dataDashRoute.root}/${this.dataDashRoute.indexAlerts}`));
  }

  private async loadAlerts(): Promise<void> {
    try {
      this.isLoading = true;
      const searchTerm = this.form.value.searchTerm;
      const isFavoriteOnly = this.form.value.favoriteIndexOnly;
      const { results, count } = (await firstValueFrom(
        this.alertTriggerService.getAlerts(this.page, this.pageSize, searchTerm, isFavoriteOnly)
      )) as PaginationResponseV2<Alert>;
      this.total = count;
      this.alerts.push(...results);

      // Group result by dates
      this.alertsByDate = groupByDate<Alert>(results, 'created_at', this.alertsByDate);
      this.alertDates = Object.keys(this.alertsByDate);
    } catch (e) {
      this.toast.error('Failed to load index alerts.')
    } finally {
      this.isLoading = false;
    }
  }

  async downloadAll() {
    const allAlerts = (await firstValueFrom(this.alertTriggerService.getAlerts())) as Alert[];

    downloadXLS(`IndexAlerts__${new Date()}`, [
      {
        name: 'IndexAlerts',
        type: XLSContentDataType.Array,
        content: [
          ['Alert Type', 'Index', 'Triggered By', 'Created At'],
          ...allAlerts.map((e) => [
            e.log_type,
            e.index_details_id.stable_index_code,
            e.triggered_by?.name,
            e.created_at,
          ]),
        ],
      },
    ]);
  }
}
