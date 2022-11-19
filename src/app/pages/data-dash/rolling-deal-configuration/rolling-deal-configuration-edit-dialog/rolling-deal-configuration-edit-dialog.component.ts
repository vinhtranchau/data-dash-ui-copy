import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import { RollingDealConfigurationService } from '../../../../core/services/rolling-deal-configuration.service';
import { ToastService } from '../../../../ui-kit/toast/toast.service';
import { RollingDealConfigurationData } from '../../../../core/models/rolling-deal-configuration.model';
import { ClientIndex } from '../../../../core/models/trading-center.model';

@Component({
  selector: 'dd-rolling-deal-configuration-edit-dialog',
  templateUrl: './rolling-deal-configuration-edit-dialog.component.html',
  styleUrls: ['./rolling-deal-configuration-edit-dialog.component.scss'],
})
export class RollingDealConfigurationEditDialogComponent implements OnInit {
  isLoading = false;
  form: FormGroup = this.buildForm();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { config?: RollingDealConfigurationData; indexes: ClientIndex[] },
    private dialogRef: MatDialogRef<RollingDealConfigurationEditDialogComponent>,
    private readonly fb: FormBuilder,
    private readonly rollingDealConfigurationService: RollingDealConfigurationService,
    private readonly toast: ToastService
  ) {}

  ngOnInit(): void {
    this.form = this.buildForm();
    if (Boolean(this.data.config)) {
      this.form.get('indexId')?.disable();
    }
  }

  async save() {
    try {
      this.isLoading = true;
      const { id, minimum_call_strike_ratio, maximum_put_strike_ratio, minimum_spread_ratio, maximum_spread_ratio } =
        this.form.value;
      const formValue = {
        ...this.form.value,
        minimum_call_strike_ratio: minimum_call_strike_ratio / 100,
        maximum_put_strike_ratio: maximum_put_strike_ratio / 100,
        minimum_spread_ratio: minimum_spread_ratio / 100,
        maximum_spread_ratio: maximum_spread_ratio / 100,
      };

      if (id) {
        await firstValueFrom(this.rollingDealConfigurationService.updateRollingDealConfiguration(id, formValue));
      } else {
        await firstValueFrom(
          this.rollingDealConfigurationService.createRollingDealConfiguration(this.data.config!.index.id)
        );
      }
      this.dialogRef.close(true);
    } catch (e) {
      this.toast.error('Failed to create configuration for selected index.');
    } finally {
      this.isLoading = false;
    }
  }

  private buildForm() {
    const data = this.data.config;
    return this.fb.group({
      id: data!.id || '',
      sic: data!.index.stable_index_code,
      minimum_call_strike_ratio: data!.minimum_call_strike_ratio * 100,
      maximum_put_strike_ratio: data!.maximum_put_strike_ratio * 100,
      minimum_spread_ratio: data!.minimum_spread_ratio * 100,
      maximum_spread_ratio: data!.maximum_spread_ratio * 100,
      maximum_delay: data!.maximum_delay,
      maximum_duration: data!.maximum_duration,
      minimum_fixations: data!.minimum_fixations,
      minimum_coverage_length: data!.minimum_coverage_length,
      maximum_contract_length: data!.maximum_contract_length,
      last_available_expiration_length: data!.last_available_expiration_length,
      minimum_volume: data!.minimum_volume,
      maximum_volume: data!.maximum_volume,
      minimum_risk_capital_per_deal: data!.minimum_risk_capital_per_deal,
      maximum_risk_capital_per_deal: data!.maximum_risk_capital_per_deal,
      maximum_risk_capital_per_index: data!.maximum_risk_capital_per_index,
    });
  }
}
