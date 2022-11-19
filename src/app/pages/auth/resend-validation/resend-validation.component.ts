import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { AuthService } from '../../../core/services/auth.service';
import { ResendValidationForm, resendValidationFormGroup } from '../../../core/strict-typed-forms/auth.form';
import { ToastService } from '../../../ui-kit/toast/toast.service';

@Component({
  selector: 'dd-resend-validation',
  templateUrl: './resend-validation.component.html',
})
export class ResentValidationComponent {
  form: FormGroup<ResendValidationForm> = this.fb.nonNullable.group({ ...resendValidationFormGroup });
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toast: ToastService,
    private router: Router
  ) {
  }

  async sendLink() {
    const { email } = this.form.value;
    if (!email) {
      return;
    }
    this.isLoading = true;
    try {
      await firstValueFrom(this.authService.resendValidationEmail(email));
      this.router.navigate(['/login']).then();
      this.toast.success('Another email has been sent. Please check your inbox.');
    } catch (e: any) {
      if (e.error.data === 'invalid email') {
        this.toast.error('This email does not exists.');
      } else {
        this.toast.error('Failed to send another code to your email.');
      }
    } finally {
      this.isLoading = false;
    }
  }
}
