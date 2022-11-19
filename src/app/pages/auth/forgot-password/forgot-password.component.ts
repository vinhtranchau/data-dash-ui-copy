import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../ui-kit/toast/toast.service';
import { ForgotPasswordForm, forgotPasswordFormGroup } from '../../../core/strict-typed-forms/auth.form';

@Component({
  selector: 'dd-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  form: FormGroup<ForgotPasswordForm> = this.fb.nonNullable.group({ ...forgotPasswordFormGroup });

  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toast: ToastService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
  }

  async sendLink() {
    const { email, password } = this.form.value;
    if (!email || !password) {
      return;
    }
    this.isLoading = true;
    try {
      await firstValueFrom(this.authService.sendResetPasswordLink(email, password));
      this.router.navigate(['/login']).then();
      this.toast.success('We have sent a confirmation email. Please check your inbox.');
    } catch (e: any) {
      if (e.error.data === 'invalid email') {
        this.toast.error('This email does not exists.');
      } else {
        this.toast.error('Failed to send a reset password link to your email.');
      }
    } finally {
      this.isLoading = false;
    }
  }
}
