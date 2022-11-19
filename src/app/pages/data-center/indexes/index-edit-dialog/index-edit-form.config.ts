import { UntypedFormArray, Validators } from '@angular/forms';
import { Index } from '../../../../core/models/index.model';

export function indexSpecificationFormGroup(index: Index | null) {
  const data = index || ({ product_id: {}, nation_id: {}, currency_id: {}, unit_id: {} } as Index);
  return {
    stable_index_code: [data.stable_index_code || null, [Validators.required, Validators.maxLength(20)]],
    index_provider_code: [data.index_provider_code || null, Validators.maxLength(100)],
    product: [data.product_id.id || null, Validators.required],
    specification: [data.specification || null, [Validators.required, Validators.maxLength(400)]],
    specification_notes: [data.specification_notes || null, Validators.maxLength(400)],
    delivery_point: [data.delivery_point || null, Validators.maxLength(200)],
    nation: [data.nation_id.id || null, Validators.required],
    currency: [data.currency_id.id || null, Validators.required],
    is_currency_cents: [data.is_currency_cents || false, Validators.required],
    unit: [data.unit_id.id || null, [Validators.required]],
    unit_multiplier: [data.unit_multiplier || 1],
  };
}

export function indexProviderFormGroup(index: Index | null) {
  const data = index || ({ index_provider_id: {} } as Index);
  return {
    index_provider: [data.index_provider_id.id || null, Validators.required],
    index_provider_methodology: [data.index_provider_methodology || null, Validators.maxLength(2000)],
    price_update_type: [data.price_update_type || null],
    price_update_url: [data.price_update_url || null, Validators.maxLength(2000)],
    source_publication_notes: [data.source_publication_notes || null, Validators.maxLength(1000)],
    public_access: [data.public_access || null],
    trusted_access: [data.trusted_access || null],
  };
}

export function indexBundleFormulaFormGroup(key: string | null, value: number | null, disabled: boolean) {
  return {
    bundle_coefficient: [{ value: value, disabled: disabled }],
    bundle_stable_index_code: [{ value: key, disabled: disabled }]
  };
}

export function indexDataFormGroup(index: Index | null, bundleFormulaFormGroup: UntypedFormArray) {
  const data = index || ({} as Index);
  return {
    price_frequency: [data.price_frequency || null, Validators.required],
    publishing_delay_min_multiplier: [data.publishing_delay_min_multiplier || 0],
    publishing_delay_max_multiplier: [data.publishing_delay_max_multiplier || 0],
    publishing_delay_units: [data.publishing_delay_units || null],
    business_day_convention: [data.business_day_convention || null, Validators.maxLength(200)],
    proxy_type: [data.proxy_type || null],
    proxy_index: [data.proxy_index_id ? data.proxy_index_id.map((obj) => {
      return obj.id
    }) : []],
    proxy_factor: [data.proxy_factor || null, Validators.maxLength(200)],
    proxy_notes: [data.proxy_notes || null, Validators.maxLength(200)],
    index_calculation: [data.index_calculation || null, Validators.maxLength(200)],
    bundle_formula: bundleFormulaFormGroup,
    bundle_display_formula: [{ value: null, disabled: true }, Validators.maxLength(400)],
  };
}

export function indexGradingFormGroup(index: Index | null) {
  const data = index || ({} as Index);
  return {
    tier: [data.tier || null],
    underwriter_approval: [data.underwriter_approval || null],
    index_state: [data.index_state || null, Validators.required],
    index_type: [data.index_type || null, Validators.required],
    stable_grading_methodology: [data.stable_grading_methodology || null],
    stable_grading_data_integrity: [data.stable_grading_data_integrity || null],
    stable_grading_data_availability: [data.stable_grading_data_availability || null],
    stable_grading_index_robustness: [data.stable_grading_index_robustness || null],
    stable_grading_total_grade: [data.stable_grading_total_grade || null],
    index_notes: [data.index_notes || null, Validators.maxLength(1000)],
    cfp_ready: [data.cfp_ready || false],
    in_hedging_book: [data.in_hedging_book || false],
    is_rolling_deal: [data.is_rolling_deal || false],
  };
}
