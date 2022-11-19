import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import { OptionTypes, SellingMonths, StrikeCalculationTypes } from '../models/empirical-modelling.model';
import { PositiveNumber } from '../validators/positive-number';

export interface EmpiricalModellingForm {
  contracts: FormArray<FormGroup<EmpiricalModellingContractForm>>;
}

export interface EmpiricalModellingContract {
  duration: number;
  sellingMonth: SellingMonths[];
  startingDelay: number;
  optionType?: OptionTypes;
  strikeCalculation?: StrikeCalculationTypes;
  strike?: number;
  limit?: number;
  contractSize?: number;
}

export interface EmpiricalModellingContractForm {
  optionType: FormControl<any>;
  strikeCalculation: FormControl<any>;
  strike: FormControl<any>;
  limit: FormControl<any>;
  sellingMonth: FormControl<any>;
  startingDelay: FormControl<any>;
  duration: FormControl<any>;
  contractSize: FormControl<any>;
}

export const empiricalModellingContractFormGroup = {
  optionType: [OptionTypes.Call, [Validators.required]],
  strikeCalculation: [StrikeCalculationTypes.AtmRatio, [Validators.required]],
  strike: [null, [Validators.required, PositiveNumber.createValidator()]],
  limit: [null, [Validators.required, PositiveNumber.createValidator()]],
  sellingMonth: [[], [Validators.required]],
  startingDelay: [null, [Validators.required]],
  duration: [null, [Validators.required]],
  contractSize: [1, [Validators.required]],
};
