import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { RegisterForm, registerFormGroup } from '../../../core/strict-typed-forms/auth.form';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../ui-kit/toast/toast.service';
import { ToastPriority } from '../../../ui-kit/toast/toast.model';

@Component({
  selector: 'dd-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  form: FormGroup<RegisterForm> = this.fb.nonNullable.group({ ...registerFormGroup });

  isLoading = false;
  haveMagicCode = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toast: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  async register() {
    const { firstName, lastName, email, password, magicCode } = this.form.value;
    const name = `${firstName} ${lastName}`.trim();

    if (!email || !password || !firstName) {
      return;
    }

    try {
      this.isLoading = true;
      await firstValueFrom(this.authService.register(name, email, password, magicCode));
      this.toast.success(
        'Your account has successfully registered. Please check your inbox to validate your account.',
        ToastPriority.High
      );
      this.router.navigate(['/login']).then();
    } catch (e) {
      this.toast.error('Failed to create an account. Please try again.');
    } finally {
      this.isLoading = false;
    }
  }
}
