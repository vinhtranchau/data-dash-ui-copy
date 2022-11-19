import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScrollableContentComponent } from './scrollable-content.component';
import { SlideComponent } from './slide/slide.component';
import { FormKitModule } from '../form-kit/form-kit.module';
import { DirectiveModule } from '../directive/directive.module';

@NgModule({
  declarations: [ScrollableContentComponent, SlideComponent],
  imports: [CommonModule, FormKitModule, DirectiveModule],
  exports: [ScrollableContentComponent, SlideComponent],
})
export class ScrollableContentModule {}
