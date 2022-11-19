import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormKitModule } from '../../ui-kit/form-kit/form-kit.module';
import { AuthLayoutModule } from '../../layout/auth-layout/auth-layout.module';

import { AuthRoutingModule } from './auth-routing.module';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ValidateEmailComponent } from './validate-email/validate-email.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ConfirmResetPasswordComponent } from './confirm-reset-password/confirm-reset-password.component';
import { ResentValidationComponent } from './resend-validation/resend-validation.component';
import { TwoFactorAuthComponent } from './two-factor-auth/two-factor-auth.component';
import { OnboardingModule } from './onboarding/onboarding.module';
import { SidePanelComponent } from './side-panel/side-panel.component';
import { SidePanelModule } from './side-panel/side-panel.module';
import { ContactUsComponent } from './contact-us/contact-us.component';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    ValidateEmailComponent,
    ForgotPasswordComponent,
    ConfirmResetPasswordComponent,
    ResentValidationComponent,
    TwoFactorAuthComponent,
    ContactUsComponent,
  ],
  imports: [CommonModule, FormKitModule, AuthLayoutModule, OnboardingModule, AuthRoutingModule, SidePanelModule],
})
export class AuthModule {}
