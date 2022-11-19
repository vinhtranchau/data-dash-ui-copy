import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { RoleService } from '../services/role.service';
import { generalAccessPermissionTypes, PermissionType } from '../models/permission.model';
import { dataDashRoute } from '../routes/data-dash.route';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../../ui-kit/toast/toast.service';
import { ToastPriority } from '../../ui-kit/toast/toast.model';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(
    private router: Router,
    private roleService: RoleService,
    private authService: AuthService,
    private toast: ToastService,
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    try {
      const { type, level, platform } = route.data;

      // NOTE: Permission types are different.
      //  1. General access
      //    example: DataCenterAccess: boolean
      //  2. Level access
      //    example: IndexExtensionDataTable: PermissionLevel (0, 1, 2)
      //  Check permission.model.ts

      if (generalAccessPermissionTypes.find((x) => x === type)) {
        if (Boolean(this.roleService.getPermissionLevel(type))) {
          return true;
        } else {
          this.toast.error('Invalid permissions to access this page', ToastPriority.Medium);
          if (Boolean(this.roleService.getPermissionLevel(PermissionType.DataDashAccess))) {
            this.router.navigate(['/' + dataDashRoute.root + '/' + dataDashRoute.home]).then();
          } else {
            this.authService.logout();
          }
          return false;
        }
      }

      // If permission type is level access, then calculate this
      const currentLevel = this.roleService.getPermissionLevel(type);

      if (currentLevel >= level) {
        return true;
      } else {
        this.toast.error('Invalid permissions to access this page', ToastPriority.Medium);
        this.router.navigate([`/${platform}`]).then();
        return false;
      }
    } catch {
      this.authService.logout();
      return false;
    }
  }
}
