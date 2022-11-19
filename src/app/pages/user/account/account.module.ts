import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountComponent } from './account.component';
import { AccountRoutingModule } from './account-routing.module';
import { FormKitModule } from '../../../ui-kit/form-kit/form-kit.module';
import { SpinnerModule } from '../../../ui-kit/spinner/spinner.module';
import { ProfileComponent } from './profile/profile.component';
import { OnboardingModule } from '../../auth/onboarding/onboarding.module';
import { HelpComponent } from './help/help.component';
import { AlertSubscriptionComponent } from './alert-subscription/alert-subscription.component';
import { PipeModule } from '../../../ui-kit/pipe/pipe.module';

@NgModule({
  declarations: [AccountComponent, ProfileComponent, HelpComponent, AlertSubscriptionComponent],
  imports: [CommonModule, AccountRoutingModule, FormKitModule, SpinnerModule, OnboardingModule, PipeModule],
})
export class AccountModule {}
