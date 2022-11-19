import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { PermissionType } from '../../../../core/models/permission.model';
import { dataDashRoute } from '../../../../core/routes/data-dash.route';
import { dataCenterRoute } from '../../../../core/routes/data-center.route';
import { RoleService } from '../../../../core/services/role.service';

@Component({
  selector: 'dd-platform-toggle',
  templateUrl: './platform-toggle.component.html',
  styleUrls: ['./platform-toggle.component.scss'],
})
export class PlatformToggleComponent implements OnInit {
  dataDashRoute = dataDashRoute;
  dataCenterRoute = dataCenterRoute;

  hasDataCenterAccess = false;
  hasDataDashAccess = false;

  constructor(public roleService: RoleService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.hasDataCenterAccess = Boolean(this.roleService.getPermissionLevel(PermissionType.DataCenterAccess));
    this.hasDataDashAccess = Boolean(this.roleService.getPermissionLevel(PermissionType.DataDashAccess));
  }

  closeDialog() {
    this.dialog.closeAll();
  }
}
