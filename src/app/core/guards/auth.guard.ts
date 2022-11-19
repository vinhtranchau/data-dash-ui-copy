import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { SwPush } from '@angular/service-worker';
import { firstValueFrom, Observable } from 'rxjs';
import * as LogRocket from 'logrocket';

import { environment } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';
import { PendoService } from '../services/pendo.service';
import { LocalStorageService } from '../services/local-storage.service';
import { WebsocketService } from '../services/websocket.service';
import { NotificationService } from '../services/notification.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private pendoService: PendoService,
    private localStorageService: LocalStorageService,
    private websocketService: WebsocketService,
    private notificationService: NotificationService,
    private swPush: SwPush
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    try {
      if (!this.authService.isAuthenticated) {
        this.authService.logout();
        if (state.url) {
          this.authService.redirectUrl = state.url;
          this.authService.redirectUrl$.next(this.authService.redirectUrl);
        }
        return false;
      } else {
        this.initPlugins();
        return true;
      }
    } catch {
      this.authService.logout();
      return false;
    }
  }

  private initPlugins() {
    // Init LogRocket
    if (environment.logRocket) {
      LogRocket.identify(this.authService.user.id || '', {
        name: this.authService.user.name || '',
        email: this.authService.user.email || '',
      });
    }

    // Init Pendo
    if (environment.pendo_env) {
      this.pendoService.initialise(
        this.authService.user.id || '',
        this.authService.user.email || '',
        this.authService.user.name || '',
        this.localStorageService.getPermissions().permissions?.permissions_group || ''
      );
    }

    // Init websocket
    if (!this.websocketService.client) {
      this.websocketService.connectWS();
    }

    // Init push notifications
    if (this.swPush.isEnabled && !this.localStorageService.getNotificationEndpoint()) {
      if (environment.vapid_public_key && !this.localStorageService.getNotificationEndpoint()) {
        this.swPush
          .requestSubscription({
            serverPublicKey: environment.vapid_public_key,
          })
          .then((subscription) => {
            // Set and register endpoint with server
            this.localStorageService.setNotificationEndpoint(subscription.endpoint);
            this.registerNotificationEndpoint(subscription).then();
          })
          .catch((err) => {});
      }
    }
  }

  private async registerNotificationEndpoint(subscription: PushSubscription) {
    await firstValueFrom(this.notificationService.registerSubscription(subscription)).then();
  }
}
