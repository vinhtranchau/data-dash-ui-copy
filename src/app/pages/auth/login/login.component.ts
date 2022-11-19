import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../ui-kit/toast/toast.service';
import { LoginForm, loginFormGroup } from '../../../core/strict-typed-forms/auth.form';

@Component({
  selector: 'dd-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form: FormGroup<LoginForm> = this.fb.nonNullable.group({ ...loginFormGroup });

  isLoading = false;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private toast: ToastService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
  }

  async login() {
    const { email, password } = this.form.value;
    if (!email || !password) {
      return;
    }
    this.isLoading = true;
    try {
      const res = await firstValueFrom(this.authService.login(email, password))

      if (res) { // no 2-FA enabled
        const previousUrl = this.authService.redirectUrl;
        if (previousUrl) {
          this.router.navigateByUrl(decodeURIComponent(previousUrl)).then();
        } else {
          this.router.navigate(['/']).then();
        }
      } else { // 2-FA enabled
        this.router.navigate(['auth', 'two-factor-auth']).then();
      }
    } catch (e: any) {
      if (e.error.detail === 'Either the Email or Password was incorrect') {
        this.toast.error('Invalid credentials. Please try again.');
      } else if (e.error.detail === 'Please verify your email!') {
        this.toast.error('Email is not validated yet, please check your inbox.');
      } else if (e.status === 429) {
        this.toast.error('Too many failed login attempts, please try again later or reset your password.')
      } else {
        this.toast.error('User is not allowed access or something went wrong...');
      }
    } finally {
      this.isLoading = false;
    }
  }
}
