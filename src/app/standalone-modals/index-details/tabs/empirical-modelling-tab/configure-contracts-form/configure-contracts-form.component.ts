import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { debounceTime } from 'rxjs';

import {
  EmpiricalModellingContract,
  EmpiricalModellingContractForm,
  empiricalModellingContractFormGroup,
  EmpiricalModellingForm,
} from '../../../../../core/strict-typed-forms/risk-analysis.form';
import {
  durationOptions,
  OptionTypes,
  optionTypesOptions,
  sellingMonthsOptions,
  startingDelayOptions,
  strikeCalculationOptions,
} from '../../../../../core/models/empirical-modelling.model';

@Component({
  selector: 'dd-configure-contracts-form',
  templateUrl: './configure-contracts-form.component.html',
  styleUrls: ['./configure-contracts-form.component.scss'],
})
export class ConfigureContractsFormComponent implements OnInit {
  @Input() fullscreen: boolean;
  @Output() formChange: EventEmitter<EmpiricalModellingContract[]> = new EventEmitter<EmpiricalModellingContract[]>();
  @Output() calculate: EventEmitter<EmpiricalModellingContract[]> = new EventEmitter<EmpiricalModellingContract[]>();

  optionTypesOptions = optionTypesOptions;
  strikeCalculationOptions = strikeCalculationOptions;
  sellingMonthsOptions = sellingMonthsOptions;
  startingDelayOptions = startingDelayOptions();
  durationOptions = durationOptions();

  form = this.fb.nonNullable.group({
    contracts: this.fb.nonNullable.array<FormGroup<any>>([]),
  });

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.addContract();
    this.form.valueChanges.pipe(debounceTime(1500)).subscribe((form) => {
      if (form.contracts) {
        this.formChange.emit(this.parseValidContracts(form.contracts));
      }
    });
  }

  calculatePayOff() {
    if (this.form.valid && this.form.value.contracts) {
      this.calculate.emit(this.parseValidContracts(this.form.value.contracts));
    }
  }

  addContract() {
    this.form.controls.contracts.push(
      this.fb.nonNullable.group(
        { ...empiricalModellingContractFormGroup },
        {
          validators: this.checkStrikeLimit(),
        }
      )
    );
    setTimeout(() => {
      document.getElementById(`config-${this.form.controls.contracts.length - 1}`)!.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }, 300);
  }

  removeContract(index: number) {
    this.form.controls.contracts.removeAt(index);
  }

  private parseValidContracts(contracts: any[]): EmpiricalModellingContract[] {
    return (
      contracts
        .filter((contract) => {
          const { sellingMonth, startingDelay, duration } = contract;
          return !!(sellingMonth && startingDelay !== undefined && duration !== undefined);
        })
        // HOTFIX: Manually enforcing optional values to required for emitting
        // Form value is Partial<Interface> because of that, we can't use it directly.
        .map((contract) => ({
          startingDelay: contract.startingDelay,
          duration: contract.duration,
          sellingMonth: contract.sellingMonth,
          contractSize: contract.contractSize,
          strike: contract.strike,
          limit: contract.limit,
          optionType: contract.optionType,
          strikeCalculation: contract.strikeCalculation,
        }))
    );
  }

  private checkStrikeLimit(): ValidatorFn {
    return function (control: AbstractControl): ValidationErrors | null {
      if (control.get('limit')?.pristine || control.get('strike')?.pristine) {
        return null;
      }
      if (control.get('optionType')?.value === OptionTypes.Call) {
        if (control.get('limit')?.value <= control.get('strike')?.value) {
          return { callStrikeLimits: true };
        }
      } else {
        if (control.get('limit')?.value >= control.get('strike')?.value) {
          return { putStrikeLimits: true };
        }
      }
      return null;
    };
  }
}
