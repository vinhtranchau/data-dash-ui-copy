import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenu } from '@angular/material/menu';

import { SidebarStatusService } from '../sidebar-status.service';
import { NavItem } from '../../../core/models/nav-items.model';

@Component({
  selector: 'dd-sidebar-mobile',
  templateUrl: './sidebar-mobile.component.html',
  styleUrls: ['./sidebar-mobile.component.scss'],
  exportAs: 'sidebarMenu',
})
export class SidebarMobileComponent implements OnInit {
  @ViewChild(MatMenu, { static: true }) menu: MatMenu;

  navItems: NavItem[];

  constructor(public sidebarStatusService: SidebarStatusService) {}

  ngOnInit(): void {
    this.navItems = this.sidebarStatusService.getNavItems();
  }
}
