import { Injectable } from '@angular/core';

import { LocalStorageService } from './local-storage.service';
import { PermissionLevel, PermissionType } from '../models/permission.model';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  constructor(private localStorageService: LocalStorageService) {}

  getPermissionLevel(type: PermissionType): PermissionLevel | boolean {
    // Enforce the type for access
    const { permissions } = this.localStorageService.getPermissions() as any;
    return permissions ? permissions[type] : 0;
  }
}
