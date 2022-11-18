import { Injectable } from '@angular/core';

import { UserPermissions } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  storage = {
    accessToken: 'access_token',
    userDetails: 'user_details',
    userPermissions: 'user_permissions',
    notificationEndpoint: 'notification_endpoint',
  };

  constructor() { }

  setItem(name: string, value: any) {
    localStorage.setItem(name, value);
  }

  getItem(name: string): any {
    return localStorage.getItem(name) || '';
  }

  getSession(): string {
    return this.getItem(this.storage.accessToken);
  }

  setPermissions(userPermissions: UserPermissions) {
    this.setItem(this.storage.userPermissions, JSON.stringify(userPermissions));
  }
}
