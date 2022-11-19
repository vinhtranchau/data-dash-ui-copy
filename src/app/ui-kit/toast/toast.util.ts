import { ToastPriority, ToastType } from './toast.model';

export function getToastConfig(payload: ToastType, priority?: ToastPriority) {
  let timeOut = 2000;
  switch (priority) {
    case ToastPriority.Medium:
      timeOut = 5000;
      break;
    case ToastPriority.High:
      timeOut = 8000;
      break;
    default:
      break;
  }
  return {
    timeOut,
    tapToDismiss: true,
    closeButton: false,
    payload,
  };
}
