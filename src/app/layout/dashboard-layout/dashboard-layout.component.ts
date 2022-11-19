import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SidebarMobileComponent } from './sidebar-mobile/sidebar-mobile.component';
import { SidebarStatusService } from './sidebar-status.service';

@Component({
  selector: 'dd-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.scss'],
})
export class DashboardLayoutComponent implements OnInit {
  @ViewChild(SidebarMobileComponent) sidebarMenu: SidebarMobileComponent;

  constructor(private route: ActivatedRoute, public sidebarStatusService: SidebarStatusService) {}

  ngOnInit(): void {
    const data = this.route.snapshot.data;
    const { platform } = data;
    if (platform) {
      this.sidebarStatusService.setCurrentPlatform(platform);
    }
  }

  sidebarToggle() {
    this.sidebarStatusService.isOpen = !this.sidebarStatusService.isOpen;
    this.sidebarStatusService.isOpen$.next(this.sidebarStatusService.isOpen);
  }
}
