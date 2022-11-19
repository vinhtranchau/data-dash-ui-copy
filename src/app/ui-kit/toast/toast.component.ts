import { Component } from '@angular/core';
import { Toast, ToastPackage, ToastrService } from 'ngx-toastr';

import { ToastType } from './toast.model';

@Component({
  selector: 'dd-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent extends Toast {
  ToastType = ToastType;

  constructor(protected override toastrService: ToastrService, public override toastPackage: ToastPackage) {
    super(toastrService, toastPackage);
  }
}
