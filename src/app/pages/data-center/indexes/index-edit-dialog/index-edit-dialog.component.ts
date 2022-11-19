import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import { Index } from '../../../../core/models/index.model';
import {
  indexBundleFormulaFormGroup,
  indexDataFormGroup,
  indexGradingFormGroup,
  indexProviderFormGroup,
  indexSpecificationFormGroup,
} from './index-edit-form.config';
import { StoreService } from '../../../../core/services/store.service';
import { IndexService } from '../../../../core/services/index.service';
import { ToastService } from '../../../../ui-kit/toast/toast.service';
import { getBundleFormulaExpression } from '../../../../core/utils/index-detail.util';

@Component({
  selector: 'dd-index-edit-dialog',
  templateUrl: './index-edit-dialog.component.html',
  styleUrls: ['./index-edit-dialog.component.scss'],
})
export class IndexEditDialogComponent implements OnInit {
  startBundleFormula: UntypedFormGroup = this.fb.group({
    bundle_coefficient: [null],
    bundle_stable_index_code: [null],
  });

  form: UntypedFormGroup = this.loadIndexDetail();

  isLoading = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Index | null,
    private dialogRef: MatDialogRef<IndexEditDialogComponent>,
    private fb: UntypedFormBuilder,
    private store: StoreService,
    private indexService: IndexService,
    private toast: ToastService
  ) {
  }

  get indexSpecificationForm(): UntypedFormGroup {
    return this.form.get('steps')?.get([0]) as UntypedFormGroup;
  }

  get indexProviderForm(): UntypedFormGroup {
    return this.form.get('steps')?.get([1]) as UntypedFormGroup;
  }

  get indexDataForm(): UntypedFormGroup {
    return this.form.get('steps')?.get([2]) as UntypedFormGroup;
  }

  get indexGradingForm(): UntypedFormGroup {
    return this.form.get('steps')?.get([3]) as UntypedFormGroup;
  }

  ngOnInit(): void {
    // Fill the form with index details
    this.loadIndexDetail();

    // Load required option values from the API
    this.store.loadHierarchies();
    this.store.loadUnits();
    this.store.loadNations();
    this.store.loadCurrencies();
    this.store.loadIndexProviders();
    this.store.loadIndexUUIDs();
  }

  async save() {
    try {
      this.isLoading = true;
      let payload: any = {};
      this.form.getRawValue().steps.forEach((step: any) => (payload = { ...payload, ...step }));
      const { formulaDict } = getBundleFormulaExpression(this.form.getRawValue().steps[2].bundle_formula);
      payload = {
        ...payload,
        id: this.data ? this.data.id : null,
        product_id: payload.product,
        nation_id: payload.nation,
        currency_id: payload.currency,
        unit_id: payload.unit,
        index_provider_id: payload.index_provider,
        proxy_index_id: payload.proxy_index,
        bundle_formula: formulaDict,
      };
      await firstValueFrom(this.indexService.postIndex(payload));
      this.toast.success('Successfully saved index details.');
      this.dialogRef.close(true);
    } catch (e) {
      this.toast.error('Failed to save index details.');
    } finally {
      this.isLoading = false;
    }
  }

  private loadIndexDetail() {
    const bundleFormula = this.data ? this.data.bundle_formula : null;
    let bundleFormulaFormArray;
    if (bundleFormula) {
      bundleFormulaFormArray = Object.keys(bundleFormula).map((key) =>
        this.fb.group({ ...indexBundleFormulaFormGroup(key, bundleFormula[key], true) })
      );
    } else {
      bundleFormulaFormArray = [this.fb.group({ ...indexBundleFormulaFormGroup(null, null, false) })];
    }

    return this.fb.group({
      steps: this.fb.array([
        this.fb.group({ ...indexSpecificationFormGroup(this.data) }),
        this.fb.group({ ...indexProviderFormGroup(this.data) }),
        this.fb.group({
          ...indexDataFormGroup(this.data, this.fb.array(bundleFormulaFormArray)),
        }),
        this.fb.group({ ...indexGradingFormGroup(this.data) }),
      ]),
    });
  }
}
