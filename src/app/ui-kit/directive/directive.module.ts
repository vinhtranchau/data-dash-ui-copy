import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ObserveVisibilityDirective } from './observe-visibility.directive';

@NgModule({
  declarations: [ObserveVisibilityDirective],
  imports: [CommonModule],
  exports: [ObserveVisibilityDirective],
})
export class DirectiveModule {}
