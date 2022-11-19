import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Company } from '../../../core/models/company.model';
import { PermissionType } from '../../../core/models/permission.model';
import { AuthService } from '../../../core/services/auth.service';
import { CompanyService } from '../../../core/services/company.service';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { RoleService } from '../../../core/services/role.service';
import { ToastService } from '../../../ui-kit/toast/toast.service';

@Component({
  selector: 'dd-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  hasIndexAlertAccess = false;
  isTrustedUser: boolean = false;
  user$ = this.authService.user$;
  isUploading = false;
  company: Company | null;
  activeTab = 1;

  constructor(
    private localStorageService: LocalStorageService,
    private authService: AuthService,
    private toast: ToastService,
    private companyService: CompanyService,
    private route: ActivatedRoute,
    private roleService: RoleService
  ) {}

  ngOnInit(): void {
    this.isTrustedUser = this.localStorageService.getUser().is_trusted_user || false;
    this.hasIndexAlertAccess = this.roleService.getPermissionLevel(PermissionType.IndexAlerts) as boolean;
    this.getCompany();
    const { tab } = this.route.snapshot.params;
    this.activeTab = parseInt(tab) || 1;

    if (!this.hasIndexAlertAccess && this.activeTab == 4) {
      this.activeTab = 1;
    }
    // Active tab can only be 1, 2, 3, 4, or 5 for now
    if (![1, 2, 3, 4, 5].includes(this.activeTab)) {
      this.activeTab = 1;
    }
  }

  upload(): void {
    if (!this.isUploading) {
      document.getElementById('selectedFile')!.click();
    }
  }

  async selectFile(e: any) {
    try {
      this.isUploading = true;

      const file: File = e.target.files[0];
      const pattern = /image-*/;

      if (!file.type.match(pattern)) {
        this.toast.error('Invalid file format.');
        return;
      }

      if (file.size > 5242880) {
        this.toast.error('File upload cannot be larger than 5MB.');
        return;
      }

      const formData = new FormData();
      formData.append('avatar', file);
      const res = await firstValueFrom(this.authService.changeAvatar(formData));
      this.authService.user.avatar = res.avatar;
      this.localStorageService.setUser(this.authService.user);
      this.user$.next(this.authService.user);
      this.toast.success('Upload successful.');
    } catch (e) {
      this.toast.error('Unable to upload, something went wrong.');
    } finally {
      this.isUploading = false;
    }
  }

  async getCompany() {
    this.company = await firstValueFrom(this.companyService.getCompany());
  }

  switchTab(tab: number) {
    this.activeTab = tab;
  }
}
