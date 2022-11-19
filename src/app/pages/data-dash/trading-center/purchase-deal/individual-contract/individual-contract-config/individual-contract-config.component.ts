import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime, filter, firstValueFrom, Subject, takeUntil } from 'rxjs';

import { OptionTypes, optionTypesOptions } from '../../../../../../core/models/empirical-modelling.model';
import { ClientIndex, ContractType, StatusType } from '../../../../../../core/models/trading-center.model';
import { LocalStorageService } from '../../../../../../core/services/local-storage.service';
import { TradingCenterService } from '../../../../../../core/services/trading-center.service';
import {
  IndividualContractConfigForm,
  ContractConfigQuote,
} from '../../../../../../core/strict-typed-forms/trading-center.form';
import { getCoverageEnd, getCoverageStart, addTimezone } from '../../../../../../core/utils/dates.util';
import { getDecimal } from '../../../../../../core/utils/number.util';
import { ToastService } from '../../../../../../ui-kit/toast/toast.service';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { QuoteDialogComponent } from './quote-dialog/quote-dialog.component';
import { RedirectDialogComponent } from './redirect-dialog/redirect-dialog.component';

@Component({
  selector: 'dd-individual-contract-config',
  templateUrl: './individual-contract-config.component.html',
  styleUrls: ['./individual-contract-config.component.scss'],
})
export class IndividualContractConfigComponent implements OnInit, OnDestroy {
  @Input() indexDetails: ClientIndex;
  @Input() indexId: string;
  @Input() form: FormGroup<IndividualContractConfigForm>;
  @Input() maxStrike: number;

  statusType = StatusType;
  contractType = ContractType;

  optionTypesOptions = optionTypesOptions;
  optionTypes = OptionTypes;
  tradeId: string;
  hasFinishedQuoting: boolean = false;
  hasEditPermission: boolean;

  tradePremium: number;
  maximumQuantity: number = 0;
  minimumQuantity: number = 1;
  quoteTimeRemaining: number = 299;
  interval: ReturnType<typeof setInterval>;

  isBidding = false;

  isTradingEngineOnline: boolean = false;

  private unsubscribeAll: Subject<any> = new Subject<any>();

  coverageStartOptions = [...Array(3).keys()].map((number) => ({
    label: addTimezone(getCoverageStart(number + 1))
      .toISOString()
      .split('T')[0],
    id: number + 1,
  }));
  coverageEndOptions = [...Array(3).keys()].map((number) => ({
    label: addTimezone(getCoverageEnd(number + 1))
      .toISOString()
      .split('T')[0],
    id: number + 1,
  }));

  dateFilter = (d: Date | null): boolean => {
    let day = new Date();
    if (d) {
      day = addTimezone(d);
    }
    // Validate date between tomorrow and coverage end in
    return day >= new Date() && day <= addTimezone(getCoverageStart(this.form.get('start_month_delta')?.getRawValue()));
  };

  constructor(
    private tradingCenterService: TradingCenterService,
    private dialog: MatDialog,
    private localStorageService: LocalStorageService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.checkTradingEngine();

    this.hasFinishedQuoting = false;
    this.tradeId = '';
    this.hasEditPermission = (this.localStorageService.getPermissions().permissions?.trading_center || 0) > 1 || false;
    this.form
      .get('start_month_delta')
      ?.valueChanges.pipe(takeUntil(this.unsubscribeAll))
      .subscribe((value) => {
        this.coverageEndOptions = [...Array(4 - value).keys()].map((number) => ({
          label: addTimezone(getCoverageEnd(number + value))
            .toISOString()
            .split('T')[0],
          id: number + value,
        }));

        if (this.form.get('end_month_delta')?.value < value) {
          this.form.get('end_month_delta')?.setValue(value);
        }
      });

    this.form.setValidators(this.checkStrikeLimit());

    this.form
      .get('quantity')
      ?.valueChanges.pipe(debounceTime(500))
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((quantity) => {
        this.form.get('totalPrice')?.setValue(getDecimal(this.form.get('pricePerUnit')?.getRawValue() * quantity, 4));
        this.form.get('totalPrice')?.updateValueAndValidity();
      });

    this.form
      .get('pricePerUnit')
      ?.valueChanges.pipe(debounceTime(500))
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((price) => {
        this.form.get('totalPrice')?.setValue(getDecimal(this.form.get('quantity')?.value * price, 4));
        this.form.get('totalPrice')?.updateValueAndValidity();
      });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }

  private checkStrikeLimit(): ValidatorFn {
    return function (control: AbstractControl): ValidationErrors | null {
      if (control.value.direction == OptionTypes.Call) {
        return control.value.strike >= control.value.limit ? { invalidStrikeLimit: true } : null;
      } else {
        return control.value.limit >= control.value.strike ? { invalidStrikeLimit: true } : null;
      }
    };
  }

  async requestQuote() {
    try {
      const payload = {
        strike: this.form.get('strike')!.value,
        limit: this.form.get('limit')!.value,
        direction: this.form.get('direction')!.value,
        start_month_delta: this.form.get('start_month_delta')!.value,
        end_month_delta: this.form.get('end_month_delta')!.value,
      };
      const results = await firstValueFrom(
        this.tradingCenterService.requestQuote(this.indexId, payload as ContractConfigQuote)
      );
      this.tradeId = results.id;

      // Check server return coverage start is still the same as input
      if (
        new Date(results.coverage_start_in).getTime() !==
        addTimezone(getCoverageStart(this.form.get('start_month_delta')!.value)).getTime()
      ) {
        throw 'Contract config has expired.';
      }

      this.dialog
        .open(QuoteDialogComponent, {
          data: { tradeId: results.id },
          closeOnNavigation: true,
          disableClose: true,
          panelClass: 'rootModal',
          autoFocus: false,
        })
        .afterClosed()
        .subscribe(() => {
          this.finishQuote();
        });
    } catch (e) {
      this.toast.error('Something went wrong, please refresh the page and try again or contact the admins.');
    } finally {
    }
  }

  async finishQuote() {
    const results = await firstValueFrom(this.tradingCenterService.getTradeRequest(this.tradeId));
    this.hasFinishedQuoting = true;
    this.maximumQuantity = results.maximum_quantity;
    this.minimumQuantity = results.minimum_quantity;
    this.tradePremium = getDecimal(results.premium, 4);

    this.form.get('quantity')?.addValidators(Validators.max(results.maximum_quantity));
    this.form.get('quantity')?.addValidators(Validators.min(results.minimum_quantity));
    this.form.get('pricePerUnit')?.setValue(this.tradePremium);
    this.form.get('pricePerUnit')?.updateValueAndValidity();
    this.form.get('quantity')?.setValue(Math.floor((results.minimum_quantity + results.maximum_quantity) / 2));

    this.form.get('direction')?.disable();
    this.form.get('strike')?.disable();
    this.form.get('limit')?.disable();
    this.form.get('start_month_delta')?.disable();
    this.form.get('end_month_delta')?.disable();

    this.quoteTimeRemaining = 299;
    this.interval = setInterval(() => {
      if (this.quoteTimeRemaining > 0) {
        this.quoteTimeRemaining -= 1;
      } else {
        this.toast.error('Quote has expired! Please request for a new quote to proceed.');
        this.dialog.closeAll();
        this.requestNewQuote();
      }
    }, 1000);

    setTimeout(() => {
      document.getElementById('request-quote-start')!.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }, 300);
  }

  requestNewQuote() {
    clearInterval(this.interval);
    this.tradeId = '';
    this.hasFinishedQuoting = false;
    this.form.get('direction')?.enable();
    this.form.get('strike')?.enable();
    this.form.get('limit')?.enable();
    this.form.get('start_month_delta')?.enable();
    this.form.get('end_month_delta')?.enable();
    if (this.isBidding) {
      this.toggleBidding();
    }
  }

  async completeTrade(type: StatusType) {
    if (type === StatusType.Purchase || type === StatusType.Bid) {
      this.dialog
        .open(ConfirmationDialogComponent, {
          data: {
            tradeId: this.tradeId,
            status: type,
            indexDetails: this.indexDetails,
            ...this.form.getRawValue(),
          },
          height: '80vh',
          closeOnNavigation: true,
          disableClose: false,
          panelClass: 'rootModal',
          autoFocus: false,
        })
        .afterClosed()
        .pipe(filter((res) => res))
        .subscribe(() => {
          this.redirectUser(type);
        });
    } else if (type === StatusType.Watch) {
      await firstValueFrom(
        this.tradingCenterService.finishTradeRequest(this.tradeId, type, this.form.get('quantity')!.value)
      );
      this.redirectUser(type);
    }
  }

  redirectUser(type: StatusType) {
    this.requestNewQuote();
    this.dialog.open(RedirectDialogComponent, {
      data: {
        type: type,
      },
      closeOnNavigation: true,
      disableClose: false,
      panelClass: 'rootModal',
      autoFocus: false,
    });
  }

  toggleBidding() {
    this.isBidding = !this.isBidding;
    if (this.isBidding) {
      this.form.get('pricePerUnit')?.enable();
      this.form.get('expiration_time')?.setValidators(Validators.required);
    } else {
      this.form.get('pricePerUnit')?.setValue(this.tradePremium);
      this.form.get('pricePerUnit')?.disable();
      this.form.get('expiration_time')?.clearValidators();
      this.form.get('expiration_time')?.reset();
      this.form.get('is_partial_execution_enabled')?.reset();
    }
  }

  async checkTradingEngine() {
    try {
      const res = await firstValueFrom(this.tradingCenterService.pingTradingEngine());
      this.isTradingEngineOnline = true;
    } catch (e) {
      this.isTradingEngineOnline = false;
    }
  }
}
