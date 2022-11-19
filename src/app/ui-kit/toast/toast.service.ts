import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, Subject } from 'rxjs';

import { ToastPriority, ToastStreamData, ToastType } from './toast.model';
import { getToastConfig } from './toast.util';
import { capitalizeFirstLetter } from '../../core/utils/string.util';

@Injectable()
export class ToastService {
  stream$: Subject<ToastStreamData> = new Subject<ToastStreamData>();

  constructor(private toastr: ToastrService) {
    this.stream$.pipe(debounceTime(300)).subscribe((data) => {
      const { message, priority } = data;
      if (data.type === ToastType.Success) {
        this.success(message, priority);
      } else if (data.type === ToastType.Info) {
        this.info(message, priority);
      } else if (data.type === ToastType.Error) {
        this.error(message, priority);
      } else if (data.type === ToastType.Warning) {
        this.warning(message, priority);
      }
    });
  }

  success(message: string, priority?: ToastPriority) {
    this.toastr.show(message, '', getToastConfig(ToastType.Success, priority));
  }

  error(message: string, priority?: ToastPriority) {
    this.toastr.show(message, '', getToastConfig(ToastType.Error, priority));
  }

  info(message: string, priority?: ToastPriority) {
    this.toastr.show(message, '', getToastConfig(ToastType.Info, priority));
  }

  warning(message: string, priority?: ToastPriority) {
    this.toastr.show(message, '', getToastConfig(ToastType.Warning, priority));
  }

  apiErrorResponse(error: any) {
    if (!error.error) {
      return;
    }
    const fields = Object.keys(error.error).filter((key) => key !== 'error');
    if (fields.length) {
      fields
        .map((key) => error.error[key])
        .forEach((group) =>
          group.forEach((message: string) => {
            this.toastr.show(capitalizeFirstLetter(message), '', getToastConfig(ToastType.Error));
          })
        );
    } else {
      this.error('There was an error saving, please contact the admins!');
    }
  }
}
