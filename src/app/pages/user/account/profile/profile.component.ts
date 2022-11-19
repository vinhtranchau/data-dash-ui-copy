import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { ToastService } from 'src/app/ui-kit/toast/toast.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'dd-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  
  name = '';
  currentPass = '********';
  newPass = '********';

  isEditName = true;
  isEditPassword = true;

  hidePw = true;
  hideNewPw = true;

  user$ = this.authService.user$;

  isTwoFAEnabled: boolean;
  isTrusted: boolean;

  constructor(
    private localStorageService: LocalStorageService,
    private authService: AuthService,
    private toast: ToastService,
    private notificationService: NotificationService
  ) {
  }

  ngOnInit(): void {
    this.name = this.authService.user.name || '';
    this.isTrusted = this.localStorageService.getUser().is_trusted_user || false;
    this.isTwoFAEnabled = this.authService.user.is_2fa_enabled || false;
  }

  editName(): void {
    this.isEditName = false;
    this.isEditPassword = true;
    this.currentPass = '********';
  }

  editPassword(): void {
    this.isEditPassword = false;
    this.isEditName = true;
    this.currentPass = '';
    this.newPass = '';
    this.name = this.authService.user.name || '';
  }

  async saveName() {
    if (!this.name) {
      this.toast.error('Name is required.');
      return;
    }
    this.isEditName = true;
    try {
      await firstValueFrom(this.authService.userUpdate({name: this.name}));
      this.toast.success('Name changed successfully!');
      this.authService.user.name = this.name;
      this.localStorageService.setUser(this.authService.user);
    } catch (e) {
      this.toast.error('Name could not be changed, something went wrong.');
    }
  }

  async savePassword() {
    if (!this.newPass) {
      this.toast.error('New password is required.');
    } else if (this.newPass.length < 8) {
      this.toast.error('Password must be at least 8 characters long.');
    } else {
      try {
        await firstValueFrom(this.authService.changePassword(this.currentPass, this.newPass));
        this.toast.success('Password changed successfully.');
        this.currentPass = '********';
        this.isEditPassword = true;
        this.hidePw = true;
      } catch (e) {
        this.toast.error('Current password does not match or something went wrong.');
      }
    }
  }

  async toggle2FA() {
    try {
      await firstValueFrom(this.authService.userUpdate({is_2fa_enabled: !this.isTwoFAEnabled}));
      this.toast.success('Settings changed successfully!');
      this.authService.user.is_2fa_enabled = this.isTwoFAEnabled;
      this.localStorageService.setUser(this.authService.user);
    } catch (e) {
      this.toast.error('Settings could not be changed, something went wrong.');
    }
  }
}
