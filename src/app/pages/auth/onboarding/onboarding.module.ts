import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnboardingComponent } from './onboarding.component';
import { IntroductionComponent } from './introduction/introduction.component';
import { CompanyDetailsComponent } from './company-details/company-details.component';
import { CommodityInterestComponent } from './commodity-interest/commodity-interest.component';
import { FormKitModule } from '../../../ui-kit/form-kit/form-kit.module';
import { ErrorHandlerModule } from '../../../ui-kit/error-handler/error-handler.module';
import { AuthModule } from '../auth.module';
import { SidePanelModule } from '../side-panel/side-panel.module';


@NgModule({
  declarations: [
    OnboardingComponent,
    IntroductionComponent,
    CompanyDetailsComponent,
    CommodityInterestComponent,
  ],
  imports: [CommonModule, FormKitModule, ErrorHandlerModule, SidePanelModule],
  exports: [CompanyDetailsComponent, CommodityInterestComponent]
})
export class OnboardingModule {
}
