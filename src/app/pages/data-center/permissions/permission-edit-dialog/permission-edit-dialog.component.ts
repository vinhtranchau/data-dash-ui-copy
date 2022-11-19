import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';

import { ToastService } from '../../../../ui-kit/toast/toast.service';
import { PermissionService } from '../../../../core/services/permission.service';
import { Permission, PermissionLevelOptions } from '../../../../core/models/permission.model';
import { ForbiddenInput } from '../../../../core/validators/forbidden-input';

@Component({
  selector: 'dd-permission-edit-dialog',
  templateUrl: './permission-edit-dialog.component.html',
  styleUrls: ['./permission-edit-dialog.component.scss'],
})
export class PermissionEditDialogComponent implements OnInit {
  dialogDisabled = false;

  form: UntypedFormGroup = this.fb.group({
    permissions_group: [
      this.data.permissions_group,
      [Validators.required, Validators.maxLength(100), ForbiddenInput.createValidator('Admin')],
    ],
    group_permissions_table: [this.data.group_permissions_table || 0, [Validators.required]],
    users_table: [this.data.users_table || 0, [Validators.required]],
    index_provider_table: [this.data.index_provider_table || 0, [Validators.required]],
    hierarchy_table: [this.data.hierarchy_table || 0, [Validators.required]],
    nation_table: [this.data.nation_table || 0, [Validators.required]],
    currency_table: [this.data.currency_table || 0, [Validators.required]],
    unit_table: [this.data.unit_table || 0, [Validators.required]],
    index_details_table: [this.data.index_details_table || 0, [Validators.required]],
    index_extension_data_table: [this.data.index_extension_data_table || 0, [Validators.required]],
    historical_data_table: [this.data.historical_data_table || 0, [Validators.required]],
    scrape_matching_table: [this.data.scrape_matching_table || 0, [Validators.required]],
    can_generate_api_key: [this.data.can_generate_api_key || false, [Validators.required]],
    data_center_access: [this.data.data_center_access || false, [Validators.required]],
    data_dash_access: [this.data.data_dash_access || false, [Validators.required]],
    index_library: [this.data.index_library || 0, [Validators.required]],
    derivatives_trading: [this.data.derivatives_trading || 0, [Validators.required]],
    trading_center: [this.data.trading_center || 0, [Validators.required]],
    index_alerts: [this.data.index_alerts || 0, [Validators.required]],
    hedging_home: [this.data.hedging_home || 0, [Validators.required]],
    portfolio_summary: [this.data.portfolio_summary || 0, [Validators.required]],
    under_writer_access: [this.data.under_writer_access || 0, [Validators.required]],
    rolling_deal_configuration: [this.data.rolling_deal_configuration || 0, [Validators.required]],
  });

  PermissionLevelOptions = PermissionLevelOptions;

  constructor(
    private fb: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Permission,
    private dialogRef: MatDialogRef<PermissionEditDialogComponent>,
    private toast: ToastService,
    private permissionService: PermissionService
  ) {}

  ngOnInit(): void {
    if (this.data.id) {
      this.form.get('permissions_group')?.disable();
    }
  }

  async save() {
    try {
      const payload = this.form.value;
      if (this.data.id) {
        payload.id = this.data.id;
      }
      this.form.disable();
      this.dialogDisabled = true;
      if (!this.data.id) {
        // Create new permission
        await firstValueFrom(this.permissionService.createPermission(payload));
      } else {
        // Update old permission
        await firstValueFrom(this.permissionService.editPermission(payload));
      }
      this.toast.success('Successfully saved permissions group details.');
      this.dialogRef.close(true);
    } catch (e) {
      this.toast.error('There was an error saving, please contact the admins!');
    } finally {
      this.form.enable();
      this.dialogDisabled = false;
    }
  }
}
