import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { debounceTime, Subject, takeUntil } from 'rxjs';

import {
  DealDetail,
  DealDirection,
  dealDirectionOptions,
  dealStyleOptions,
} from '../../../../../../core/models/hedging.model';
import { Index } from '../../../../../../core/models/index.model';
import { getDecimal } from '../../../../../../core/utils/number.util';

@Component({
  selector: 'dd-deal-details-configurator',
  templateUrl: './deal-details-configurator.component.html',
  styleUrls: ['./deal-details-configurator.component.scss'],
})
export class DealDetailsConfiguratorComponent implements OnInit, OnDestroy {
  @Output() changeDealConfigForm: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();

  DealDirection = DealDirection;
  dealDirectionOptions = dealDirectionOptions;
  dealStyleOptions = dealStyleOptions;

  index: Index | null;
  maxStrikeLimit: number;

  form: FormGroup = this.fb.group(
    {
      direction: ['', Validators.required],
      style: ['', Validators.required],
      quantity: [null, [Validators.required, Validators.min(1), Validators.pattern('^[0-9]*$')]], // Integer validator
      strike: [null, [Validators.required, Validators.min(0)]],
      limit: [null, [Validators.required, Validators.min(0)]],
      purchase_date: ['', Validators.required],
      coverage_start: ['', Validators.required],
      coverage_end: ['', Validators.required],
      // No need stop for now...
      // https://stablehq.slack.com/archives/D03CNH6MMPX/p1662111428104189?thread_ts=1661835401.186319&cid=D03CNH6MMPX
      // stop: [0, [Validators.required, Validators.min(0)]],
    },
    {
      validators: [this.checkStrikeLimit(), this.checkDates()],
    }
  );

  private lastIndexPrice: number;

  private unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form.valueChanges.pipe(debounceTime(100), takeUntil(this.unsubscribeAll)).subscribe(() => {
      // Need to send form itself, to check validations from the parent
      this.changeDealConfigForm.emit(this.form);
    });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }

  onSliderValueChange(event: any) {
    // Enforce slider as range slider
    const value = event as number[];
    let strike, limit;
    const direction = this.form.get('direction')?.value;
    if (direction === DealDirection.Put) {
      [limit, strike] = value;
    } else {
      [strike, limit] = value;
    }

    this.form.get('limit')?.setValue(limit);
    this.form.get('strike')?.setValue(strike);
  }

  // This function will be called from the parent
  setFormValues(index: Index | null, deal: DealDetail | null) {
    this.index = index;

    if (!this.index) {
      // When index is null, it means, nothing selected or there is an error while fetching index details.
      this.form.reset();
      return;
    }

    // Set validators on strike and limit range
    this.lastIndexPrice = this.index.last_index_price || 1;
    this.maxStrikeLimit = getDecimal(this.lastIndexPrice * 2, 3);
    if (this.lastIndexPrice) {
      this.form
        .get('strike')
        ?.setValidators([Validators.required, Validators.min(0), Validators.max(this.maxStrikeLimit)]);
      this.form
        .get('limit')
        ?.setValidators([Validators.required, Validators.min(0), Validators.max(this.maxStrikeLimit)]);
    }

    // If deal is null (selected index value or nothing selected yet)
    if (!deal) {
      this.form.reset();
      return;
    }

    const { direction, style, quantity, strike, limit, stop, purchase_date, coverage_start, coverage_end } = deal;
    this.form.get('direction')?.setValue(direction);
    this.form.get('style')?.setValue(style);
    this.form.get('quantity')?.setValue(quantity);
    this.form.get('strike')?.setValue(strike);
    this.form.get('limit')?.setValue(limit);
    this.form.get('stop')?.setValue(stop);
    this.form.get('purchase_date')?.setValue(purchase_date);
    this.form.get('coverage_start')?.setValue(coverage_start);
    this.form.get('coverage_end')?.setValue(coverage_end);
  }

  private checkStrikeLimit(): ValidatorFn {
    return function (control: AbstractControl): ValidationErrors | null {
      if (control.get('direction')?.pristine) {
        return null;
      }
      if (control.get('direction')?.value === DealDirection.Call) {
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

  private checkDates(): ValidatorFn {
    return function (control: AbstractControl): ValidationErrors | null {
      const purchaseDateControl = control.get('purchase_date');
      const coverageStartControl = control.get('coverage_start');
      const coverageEndControl = control.get('coverage_end');
      if (purchaseDateControl?.pristine || coverageStartControl?.pristine || coverageEndControl?.pristine) {
        return null;
      }
      const purchaseDate = new Date(purchaseDateControl?.value);
      const coverageStart = new Date(coverageStartControl?.value);
      const coverageEnd = new Date(coverageEndControl?.value);
      if (purchaseDate < coverageStart && coverageStart < coverageEnd) {
        return null;
      } else {
        return { invalidDates: true };
      }
    };
  }
}
