import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthLayoutComponent } from '../../layout/auth-layout/auth-layout.component';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResentValidationComponent } from './resend-validation/resend-validation.component';
import { ConfirmResetPasswordComponent } from './confirm-reset-password/confirm-reset-password.component';
import { ValidateEmailComponent } from './validate-email/validate-email.component';
import { OnboardingComponent } from './onboarding/onboarding.component';
import { AuthGuard } from '../../core/guards/auth.guard';
import { TwoFactorAuthComponent } from './two-factor-auth/two-factor-auth.component';
import { TrustedGuard } from '../../core/guards/trusted.guard';
import { ContactUsComponent } from './contact-us/contact-us.component';

const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
      },
      {
        path: 'resend-validation',
        component: ResentValidationComponent,
      },
      {
        path: 'contact-us',
        component: ContactUsComponent,
      },
      {
        path: 'auth/validate',
        component: ValidateEmailComponent,
      },
      {
        path: 'auth/confirm-reset-password',
        component: ConfirmResetPasswordComponent,
      },
      {
        path: 'auth/two-factor-auth',
        component: TwoFactorAuthComponent,
      },
      {
        path: 'onboarding',
        component: OnboardingComponent,
        canActivate: [AuthGuard, TrustedGuard],
        data: { checkForTrusted: false },
      },
      { path: '**', redirectTo: '/login' },
    ],
  },
  { path: '**', redirectTo: '/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
