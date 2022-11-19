import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';

import { UserService } from '../../../../core/services/user.service';
import { User } from '../../../../core/models/user.model';
import { ToastService } from '../../../../ui-kit/toast/toast.service';
import { PermissionService } from '../../../../core/services/permission.service';
import { Permission } from '../../../../core/models/permission.model';

@Component({
  selector: 'dd-user-edit-dialog',
  templateUrl: './user-edit-dialog.component.html',
  styleUrls: ['./user-edit-dialog.component.scss'],
})
export class UserEditDialogComponent implements OnInit {
  permissionGroups: Permission[] = [];
  dialogDisabled = false;

  form: UntypedFormGroup = this.fb.group({
    name: [{ value: this.data.name, disabled: true }],
    email: [{ value: this.data.email, disabled: true }],
    permission_id: [this.data.permissions.id, [Validators.required]],
    is_active: [this.data.is_active, [Validators.required]],
    slack_id: [this.data.slack_id],
    is_trusted_user: [this.data.is_trusted_user, [Validators.required]],
    is_email_validated: [this.data.is_email_validated, [Validators.required]],
    is_onboarded_completely: [this.data.is_onboarded_completely, [Validators.required]],
  });

  constructor(
    private fb: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: User,
    private userService: UserService,
    private permissionService: PermissionService,
    private toast: ToastService,
    private dialogRef: MatDialogRef<UserEditDialogComponent>
  ) {
  }

  ngOnInit(): void {
    this.permissionService.getPermissions().subscribe((res) => {
      this.permissionGroups = res as Permission[];
    });
  }

  async save() {
    try {
      const payload = this.form.value;
      payload.id = this.data.id;
      this.form.disable();
      this.dialogDisabled = true;
      await firstValueFrom(this.userService.editUser(payload));
      this.toast.success('User updated successfully.');
      this.dialogRef.close(true);
    } catch (e) {
      this.toast.error('Failed to update the user.');
    } finally {
      this.form.enable();
      this.dialogDisabled = false;
    }
  }
}
