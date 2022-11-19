import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { AuthService } from '../../../core/services/auth.service';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { ToastService } from '../../../ui-kit/toast/toast.service';

@Component({
  selector: 'dd-validate-email',
  templateUrl: './validate-email.component.html',
  styleUrls: ['./validate-email.component.scss'],
})
export class ValidateEmailComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private toast: ToastService,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.validate().then();
  }

  async validate() {
    try {
      const { code, two_fa } = this.route.snapshot.queryParams;
      if (two_fa) {
        // 2-FA validation
        await firstValueFrom(this.authService.validate2FA(code));
        await this.router.navigate(['/']).then();
      } else {
        // email validation
        await firstValueFrom(this.authService.validateEmail(code));
        if (this.localStorageService.getUser().is_trusted_user) {
          await this.router.navigate(['/']).then();
        } else {
          await this.router.navigate(['/onboarding']).then();
        }
      }
    } catch (e) {
      this.toast.error('Failed to validate your account.');
    }
  }
}
