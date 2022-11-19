import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderMobileComponent } from './header-mobile.component';
import { FormKitModule } from '../../ui-kit/form-kit/form-kit.module';

@NgModule({
  declarations: [
    HeaderMobileComponent
  ],
  imports: [CommonModule, FormKitModule],
  exports: [HeaderMobileComponent]
})
export class HeaderMobileModule {
}
