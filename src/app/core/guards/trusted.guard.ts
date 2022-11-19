import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { PermissionType } from '../models/permission.model';
import { dataDashRoute } from '../routes/data-dash.route';
import { AuthService } from '../services/auth.service';
import { LocalStorageService } from '../services/local-storage.service';
import { RoleService } from '../services/role.service';

@Injectable({
  providedIn: 'root',
})
export class TrustedGuard implements CanActivate {
  constructor(
    private localStorageService: LocalStorageService,
    private router: Router,
    private roleService: RoleService,
    private authService: AuthService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const { checkForTrusted } = route.data; // checkForTrusted is true means only trusted users can access and vice versa
    let allowedAccess: boolean;

    if (this.localStorageService.getUser().is_trusted_user) {
      allowedAccess = checkForTrusted;
    } else {
      allowedAccess = !checkForTrusted;
    }

    if (!allowedAccess) {
      if (Boolean(this.roleService.getPermissionLevel(PermissionType.DataDashAccess))) {
        this.router.navigate([dataDashRoute.root]).then();
      } else {
        this.authService.logout();
      }
      return false;
    }
    return true;
  }
}
