export enum ToastPriority {
  Low = 'LOW',
  Medium = 'MEDIUM',
  High = 'HIGH',
}

export enum ToastType {
  Success = 'SUCCESS',
  Error = 'ERROR',
  Warning = 'WARNING',
  Info = 'INFO',
}

export interface ToastStreamData {
  type: ToastType;
  message: string;
  priority?: ToastPriority;
}
