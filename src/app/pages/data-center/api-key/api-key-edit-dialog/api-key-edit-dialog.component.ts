import { Clipboard } from '@angular/cdk/clipboard';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { ApiKey, ApiKeyPermission } from '../../../../core/models/api-key.model';
import { ApiKeyService } from '../../../../core/services/api-key.service';
import { ToastPriority } from '../../../../ui-kit/toast/toast.model';
import { ToastService } from '../../../../ui-kit/toast/toast.service';

@Component({
  selector: 'dd-api-key-edit-dialog',
  templateUrl: './api-key-edit-dialog.component.html',
  styleUrls: ['./api-key-edit-dialog.component.scss'],
})
export class ApiKeyEditDialogComponent implements OnInit {
  environment = environment;
  apiKeyDetail: ApiKey;
  permissionsList: ApiKeyPermission[];
  remainingPermissions: ApiKeyPermission[];
  grantedPermissions: ApiKeyPermission[];
  isLoading: boolean = false;

  form: UntypedFormGroup = this.fb.group({
    id: [this.data.id],
    name: [this.data.name, [Validators.required, Validators.maxLength(255)]],
    description: [this.data.description, [Validators.required]],
    key: [{ value: this.data.key, disabled: true }],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ApiKey,
    private apiKeyService: ApiKeyService,
    private toast: ToastService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ApiKeyEditDialogComponent>,
    private clipboard: Clipboard
  ) {}

  ngOnInit(): void {
    this.remainingPermissions = [];
    this.grantedPermissions = [];
    this.loadApiKeyPermissions();
  }

  async loadApiKeyPermissions() {
    try {
      this.isLoading = true;
      this.permissionsList = await firstValueFrom(this.apiKeyService.permissionsList());
      this.permissionsList.map((allPermission) => {
        // Distributing all permissions between remaining and granted list
        let permissionFound = false;
        if (this.data.id) {
          this.data.permissions!.every((keyPermission) => {
            if (
              // Permission is set to granted list if action + basename + method + is_detail is found in key permissions
              allPermission.action === keyPermission.action &&
              allPermission.basename === keyPermission.basename &&
              allPermission.is_detail === keyPermission.is_detail &&
              allPermission.method === keyPermission.method
            ) {
              this.grantedPermissions.push(allPermission);
              permissionFound = true;
              return false;
            } else {
              return true;
            }
          });
        }
        if (!permissionFound) {
          // Permission is set to remaining list if not found
          this.remainingPermissions.push(allPermission);
        }
      });
    } catch (e) {
      this.toast.error('Failed to load api key permissions list.', ToastPriority.Low);
    } finally {
      this.isLoading = false;
    }
  }

  movePermissions(event: CdkDragDrop<ApiKeyPermission[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }

  async save() {
    try {
      this.form.disable();
      this.isLoading = true;
      const payload = {
        name: this.form.get('name')?.value,
        description: this.form.get('description')?.value,
        permissions: this.grantedPermissions,
      };
      if (!this.data.id) {
        await firstValueFrom(this.apiKeyService.createApiKey(payload));
      } else {
        await firstValueFrom(this.apiKeyService.editApiKey(this.data.id, payload));
      }
      this.toast.success('Successfully saved API Key.');
      this.dialogRef.close(true);
    } catch (e) {
      this.toast.error('Failed to save API Key.', ToastPriority.Low);
    } finally {
      this.form.enable();
      this.isLoading = false;
    }
  }

  copyApiKey() {
    this.clipboard.copy(this.data.key || '');
    this.toast.success('API Key copied to clipboard');
  }
}
