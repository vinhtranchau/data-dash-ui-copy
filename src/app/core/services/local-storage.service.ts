import { Injectable } from '@angular/core';

import { UserDetails, UserPermissions } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  storage = {
    accessToken: 'access_token',
    userDetails: 'user_details',
    userPermissions: 'user_permissions',
    notificationEndpoint: 'notification_endpoint',
  };

  constructor() {}

  setItem(name: string, value: any) {
    localStorage.setItem(name, value);
  }

  getItem(name: string): any {
    return localStorage.getItem(name) || '';
  }

  removeItem(name: string) {
    localStorage.removeItem(name);
  }

  setSession(token: string) {
    this.setItem(this.storage.accessToken, token);
  }

  getSession(): string {
    return this.getItem(this.storage.accessToken);
  }

  killSession() {
    this.removeItem(this.storage.accessToken);
    this.removeItem(this.storage.userDetails);
    this.removeItem(this.storage.userPermissions);
    this.removeItem(this.storage.notificationEndpoint);
  }

  setUser(userDetails: UserDetails) {
    this.setItem(this.storage.userDetails, JSON.stringify(userDetails));
  }

  getUser(): UserDetails {
    const user = this.getItem(this.storage.userDetails);
    if (user) {
      return JSON.parse(user);
    } else {
      return {};
    }
  }

  setPermissions(userPermissions: UserPermissions) {
    this.setItem(this.storage.userPermissions, JSON.stringify(userPermissions));
  }

  getPermissions(): UserPermissions {
    const permission = this.getItem(this.storage.userPermissions);
    if (permission) {
      return JSON.parse(permission);
    } else {
      return {};
    }
  }

  setNotificationEndpoint(endpoint: string) {
    this.setItem(this.storage.notificationEndpoint, endpoint);
  }

  getNotificationEndpoint() {
    return this.getItem(this.storage.notificationEndpoint);
  }
}
