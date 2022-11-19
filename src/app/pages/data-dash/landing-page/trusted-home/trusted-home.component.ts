import { Component, OnDestroy, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { NavItem } from '../../../../core/models/nav-items.model';
import { SidebarStatusService } from '../../../../layout/dashboard-layout/sidebar-status.service';
import { LoadingSpinner } from '../../../../ui-kit/spinner/spinner';

import { ChangeLogService } from '../../../../core/services/change-log.service';
import { ChangeLogItems } from '../../../../core/models/change-log.model';

@Component({
  selector: 'dd-trusted-home',
  templateUrl: './trusted-home.component.html',
  styleUrls: ['./trusted-home.component.scss'],
})
export class TrustedHomeComponent implements OnInit, OnDestroy {
  navItems: NavItem[];
  changeLogItems: ChangeLogItems[] = [];
  isTrustedUser: boolean = false;
  spinner: LoadingSpinner<{ loading: boolean }> = new LoadingSpinner({
    loading: 'Loading changelog...',
  });

  constructor(private changeLogService: ChangeLogService, private sidebarStatusService: SidebarStatusService) {}

  ngOnInit() {
    this.getChangelog();
    this.navItems = this.sidebarStatusService.getNavItems();
  }

  async getChangelog() {
    try {
      this.spinner.loaders.loading.show();
      this.changeLogItems = await firstValueFrom(this.changeLogService.getChangeLog());
    } catch (err) {
    } finally {
      this.spinner.loaders.loading.hide();
    }
  }

  ngOnDestroy(): void {
    this.spinner.destroy();
  }
}
