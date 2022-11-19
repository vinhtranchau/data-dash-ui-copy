import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AuthLayoutComponent } from './auth-layout.component';

@NgModule({
  declarations: [AuthLayoutComponent],
  imports: [CommonModule, RouterModule],
})
export class AuthLayoutModule {}
