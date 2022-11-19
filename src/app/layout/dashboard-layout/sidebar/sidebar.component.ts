import { Component, Input, OnInit } from '@angular/core';

import { SidebarStatusService } from '../sidebar-status.service';
import { NavItem } from '../../../core/models/nav-items.model';
import { dataDashRoute } from '../../../core/routes/data-dash.route';

@Component({
  selector: 'dd-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  @Input() closed: boolean;
  dataDashRoute = dataDashRoute;
  homePath = 'data-dash/home';

  navItems: NavItem[];

  constructor(public sidebarStatusService: SidebarStatusService) {}

  ngOnInit(): void {
    this.navItems = this.sidebarStatusService.getNavItems();
    this.homePath = `${this.sidebarStatusService.platform}/home`;
  }
}
