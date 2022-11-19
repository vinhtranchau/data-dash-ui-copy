import { Injectable } from '@angular/core';
import { w3cwebsocket } from 'websocket';

import { LocalStorageService } from './local-storage.service';
import { environment } from '../../../environments/environment';
import { Notification, WsMessageTypes } from '../models/notification.model';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  client: w3cwebsocket | null = null;
  pingInterval: ReturnType<typeof setInterval>;

  constructor(private localStorageService: LocalStorageService, private notificationService: NotificationService) {}

  async onClose(e: any) {
    // Set client to null so auth guard will trigger connect again on next page change
    this.client = null;
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
    }
  }

  connectWS() {
    const cred = this.localStorageService.getItem(this.localStorageService.storage.accessToken);
    this.client = new w3cwebsocket(`${environment.wsUrl}/ws/notification/`, cred);
    this.client.onmessage = (e) => {
      if (typeof e.data === 'string') {
        const data = JSON.parse(e.data) as Notification;
        if (data.type === WsMessageTypes.Notification) {
          this.notificationService.notificationMenu = [
            data.payload,
            ...this.notificationService.notificationMenu,
          ].slice(0, 5);
          this.notificationService.unreadCount += 1;
        }
      }
    };
    this.client.onclose = this.onClose;
    // Ping server every minute
    if (!this.pingInterval) {
      this.pingInterval = setInterval(() => {
        if (this.client!.readyState === this.client!.OPEN) {
          this.client!.send(JSON.stringify({ type: 'ping' }));
        }
      }, 45000);
    }
  }
}
