import { FormControl, Validators } from '@angular/forms';
import { OptionTypes } from '../models/empirical-modelling.model';

export interface AdditionalOptionFormValue {
  '12m_ma': boolean;
  '24m_ma': boolean;
  trend: boolean;
}

export interface AdditionalOptionsForm {
  '12m_ma': FormControl<any>;
  '24m_ma': FormControl<any>;
  trend: FormControl<any>;
}

export const AdditionalOptionsFormGroup = {
  '12m_ma': [false],
  '24m_ma': [false],
  trend: [false],
};

export interface ContractConfigQuote {
  end_month_delta: number;
  start_month_delta: number;
  direction: OptionTypes;
  strike: number;
  limit: number;
}

export interface ContractConfigFormValue extends ContractConfigQuote {
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
}

export interface IndividualContractConfigForm {
  quantity: FormControl<any>;
  start_month_delta: FormControl<any>;
  end_month_delta: FormControl<any>;
  direction: FormControl<any>;
  strike: FormControl<any>;
  limit: FormControl<any>;
  pricePerUnit: FormControl<any>;
  totalPrice: FormControl<any>;
  expiration_time: FormControl<any>;
  is_partial_execution_enabled: FormControl<any>;
}

export function individualContractConfigFormGroup() {
  return {
    quantity: [100, [Validators.required, Validators.pattern('^[0-9]*$')]],
    start_month_delta: [1, Validators.required],
    end_month_delta: [3, Validators.required],
    direction: [OptionTypes.Call, Validators.required],
    strike: [0, [Validators.required, Validators.min(0)]],
    limit: [1, [Validators.required, Validators.min(0)]],
    pricePerUnit: [{ value: 0, disabled: true }],
    totalPrice: [{ value: 0, disabled: true }],
    expiration_time: [null],
    is_partial_execution_enabled: [false],
  };
}

export interface RollingDealContractConfigForm {
  popularStructures: FormControl<any>;
  direction: FormControl<any>;
  duration: FormControl<any>;
  strikeAndLimitRatio: FormControl<any>;
  startingDelay: FormControl<any>;
  sellingMonths: FormControl<any>;
  quantity: FormControl<any>;
}
