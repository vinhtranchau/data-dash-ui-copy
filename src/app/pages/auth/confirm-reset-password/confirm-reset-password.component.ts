import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { AuthService } from '../../../core/services/auth.service';
import { ToastPriority } from '../../../ui-kit/toast/toast.model';
import { ToastService } from '../../../ui-kit/toast/toast.service';

@Component({
  selector: 'dd-confirm-reset-password',
  templateUrl: './confirm-reset-password.component.html',
  styleUrls: ['./confirm-reset-password.component.scss'],
})
export class ConfirmResetPasswordComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private toast: ToastService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.confirmResetPassword().then();
  }

  async confirmResetPassword() {
    try {
      const { code } = this.route.snapshot.queryParams;
      await firstValueFrom(this.authService.confirmResetPassword(code));
      this.toast.success('Your password is successfully changed. Please login with your new credentials.', ToastPriority.Medium);
      await this.router.navigate(['/login']);
    } catch (e) {
      this.toast.error('Failed to reset your password.');
    }
  }
}
