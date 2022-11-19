import { Component, OnInit } from '@angular/core';
import { NavItem } from '../../core/models/nav-items.model';

import { SidebarStatusService } from '../../layout/dashboard-layout/sidebar-status.service';

@Component({
  selector: 'dd-data-center',
  templateUrl: './data-center.component.html',
  styleUrls: ['./data-center.component.scss'],
})
export class DataCenterComponent implements OnInit {
  navItems: NavItem[];

  constructor(private sidebarStatusService: SidebarStatusService) {}

  ngOnInit(): void {
    this.navItems = this.sidebarStatusService.getNavItems();
  }
}
