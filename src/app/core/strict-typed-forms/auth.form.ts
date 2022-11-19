import { FormControl, Validators } from '@angular/forms';

export interface LoginForm {
  email: FormControl<string>;
  password: FormControl<string>;
  remember: FormControl<boolean>;
}

export const loginFormGroup = {
  email: ['', [Validators.required, Validators.email]],
  password: ['', Validators.required],
  remember: [false],
};

export interface RegisterForm {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  magicCode: FormControl<string>;
  agreed: FormControl<boolean>;
}

export const registerFormGroup = {
  firstName: ['', Validators.required],
  lastName: [''],
  email: ['', [Validators.required, Validators.email]],
  password: ['', [Validators.required, Validators.minLength(8)]],
  magicCode: [''],
  agreed: [false, Validators.requiredTrue],
};

export interface ResendValidationForm {
  email: FormControl<string>;
}

export const resendValidationFormGroup = {
  email: ['', [Validators.required, Validators.email]],
};

export interface ForgotPasswordForm {
  email: FormControl<string>;
  password: FormControl<string>;
}

export const forgotPasswordFormGroup = {
  email: ['', [Validators.required, Validators.email]],
  password: ['', [Validators.required, Validators.minLength(8)]],
};

export interface CompanyForm {
  name: FormControl<any>;
  city: FormControl<any>;
  country_id: FormControl<any>;
  business_type: FormControl<any>;
  turnover: FormControl<any>;
}

export const companyFormGroup = {
  name: [null, [Validators.required, Validators.maxLength(255)]],
  city: [null, [Validators.required, Validators.maxLength(255)]],
  country_id: [null, [Validators.required]],
  business_type: [null, [Validators.required]],
  turnover: [null, Validators.required],
};
