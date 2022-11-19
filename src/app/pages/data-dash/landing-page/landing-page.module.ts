import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClientHomeModule } from './client-home/client-home.module';

import { LandingPageComponent } from './landing-page.component';
import { TrustedHomeModule } from './trusted-home/trusted-home.module';

@NgModule({
  declarations: [LandingPageComponent],
  imports: [CommonModule, RouterModule, TrustedHomeModule, ClientHomeModule],
})
export class LandingPageModule {}
