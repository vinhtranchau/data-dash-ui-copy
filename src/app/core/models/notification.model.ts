export enum NotificationTypes {
  AlertTrigger = 'alert_trigger',
  System = 'system',
  RollingDeal = 'rolling_deal',
  IndexPriceSync = 'index_price_sync',
  UploadHistoricalData = 'upload_historical_data',
  AddScrapeMatching = 'add_scrape_matching',
}

export interface NotificationPayload {
  created_at: Date;
  description: string;
  id: string;
  is_read: boolean;
  notification_type: NotificationTypes;
  receiver: number;
  reference_id?: string;
  title: string;
}

export enum WsMessageTypes {
  System = 'system',
  Notification = 'notification',
}

export interface Notification {
  payload: NotificationPayload;
  type: WsMessageTypes;
}

export enum NotificationFilter {
  All = 'all',
  Unread = 'unread',
  Read = 'read',
}
