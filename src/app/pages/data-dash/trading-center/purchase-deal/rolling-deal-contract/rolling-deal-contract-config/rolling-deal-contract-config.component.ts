import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';

import { RollingDealContractConfigForm } from '../../../../../../core/strict-typed-forms/trading-center.form';
import {
  ClientIndex,
  ContractType,
  rollingDealStructureTypesOptions,
  SubmitRollingDeal,
} from '../../../../../../core/models/trading-center.model';
import {
  durationOptions,
  OptionTypes,
  optionTypesOptions,
} from '../../../../../../core/models/empirical-modelling.model';
import { Option } from '../../../../../../core/models/option.model';
import { RollingDealConfigurationData } from '../../../../../../core/models/rolling-deal-configuration.model';
import { getCoverageStart } from '../../../../../../core/utils/dates.util';
import { TradingCenterService } from '../../../../../../core/services/trading-center.service';
import { LocalStorageService } from '../../../../../../core/services/local-storage.service';
import { ToastService } from '../../../../../../ui-kit/toast/toast.service';
import { RequestPricingDialogComponent } from './request-pricing-dialog/request-pricing-dialog.component';
import { RollingDealConfigurationService } from '../../../../../../core/services/rolling-deal-configuration.service';

@Component({
  selector: 'dd-rolling-deal-contract-config',
  templateUrl: './rolling-deal-contract-config.component.html',
  styleUrls: ['./rolling-deal-contract-config.component.scss'],
})
export class RollingDealContractConfigComponent implements OnInit {
  @Input() indexDetails: ClientIndex;
  @Input() form: FormGroup<RollingDealContractConfigForm>;

  contractType = ContractType;

  structureTypesOptions = rollingDealStructureTypesOptions;
  optionTypesOptions = optionTypesOptions;
  startingDelayOptions: Option[];
  durationTypesOptions: Option[];
  sellingMonthsOptions: Option[];
  // To set strike limit ratio min max values
  strikeAndLimitRatio: number[] = [0, 0];
  strikeAndLimitRange: number[] = [0, 0];
  prevStrikeAndLimitRatio: number[] = [0, 0];

  hasEditPermission: boolean;
  isOnboardedCompletely: boolean;

  apiErrors: string[] = [];

  private rollingDealConfig: RollingDealConfigurationData;

  constructor(
    private readonly tradingCenterService: TradingCenterService,
    private readonly localStorageService: LocalStorageService,
    private readonly rollingDealConfigurationService: RollingDealConfigurationService,
    private readonly toastService: ToastService,
    private readonly dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // When rolling deal configuration is not set, we are using the default value.
    this.rollingDealConfig =
      this.indexDetails.rolling_deal_config ||
      this.rollingDealConfigurationService.getDefaultRollingDealConfiguration();
    // Build form options based on the rolling deal configuration
    this.startingDelayOptions = durationOptions(this.rollingDealConfig.maximum_delay);
    this.durationTypesOptions = durationOptions(this.rollingDealConfig.maximum_duration);

    // Build fixation date options based on the selection
    this.loadSellingMonths();
    this.form.get('startingDelay')?.valueChanges.subscribe(() => this.loadSellingMonths());
    this.form.get('duration')?.valueChanges.subscribe(() => this.loadSellingMonths());

    // Set min max value of the strike and limit ratio
    this.calculateStrikeAndLimitRatio(OptionTypes.Call);
    this.form.get('direction')?.valueChanges.subscribe((value) => this.calculateStrikeAndLimitRatio(value));

    this.hasEditPermission = (this.localStorageService.getPermissions().permissions?.trading_center || 0) > 1 || false;
    this.isOnboardedCompletely = this.localStorageService.getUser().is_onboarded_completely || false;

    // HINT: Do not use popular structure for now...
    // Handle popular structure selection
    // this.form.get('popularStructures')?.valueChanges.subscribe((structure) => {
    //   switch (structure) {
    //     case RollingDealStructureTypes.PopularStructureOne:
    //       this.setPopularStructures(
    //         [1.05, 1.2],
    //         OptionTypes.Call,
    //         2,
    //         1,
    //         [...Array(9).keys()].map((x) => x + 1)
    //       );
    //       break;
    //     case RollingDealStructureTypes.PopularStructureTwo:
    //       this.setPopularStructures(
    //         [0.95, 0.8],
    //         OptionTypes.Put,
    //         2,
    //         1,
    //         [...Array(9).keys()].map((x) => x + 1)
    //       );
    //       break;
    //     default:
    //       break;
    //   }
    // });
  }

  // setPopularStructures(
  //   strikeAndLimitRatio: number[],
  //   direction: OptionTypes,
  //   startingDelay: number,
  //   duration: number,
  //   sellingMonths: number[]
  // ) {
  //   this.form.get('strikeAndLimitRatio')?.setValue(strikeAndLimitRatio);
  //   this.form.get('direction')?.setValue(direction);
  //   this.form.get('startingDelay')?.setValue(startingDelay);
  //   this.form.get('duration')?.setValue(duration);
  //   this.form.get('sellingMonths')?.setValue(sellingMonths);
  // }

  async submitTrade() {
    try {
      this.apiErrors = [];
      const direction = this.form.get('direction')!.value;
      const limitAndStrikeRatio = this.form.get('strikeAndLimitRatio')!.value;
      const limit_ratio = direction === OptionTypes.Call ? limitAndStrikeRatio[1] / 100 : limitAndStrikeRatio[0] / 100;
      const strike_ratio = direction === OptionTypes.Call ? limitAndStrikeRatio[0] / 100 : limitAndStrikeRatio[1] / 100;
      const quantity = this.form.get('quantity')!.value;
      const startDelay = this.form.get('startingDelay')!.value;
      const duration = this.form.get('duration')!.value;

      const payload: SubmitRollingDeal = {
        trade_requests: this.form.get('sellingMonths')!.value.map((sellingMonth: number) => ({
          direction: direction,
          limit_ratio: Math.round(limit_ratio * 1000) / 1000,
          strike_ratio: Math.round(strike_ratio * 1000) / 1000,
          desired_quantity: quantity,
          start_month_delta: sellingMonth + startDelay,
          end_month_delta: sellingMonth + startDelay + duration - 1,
          fixation_month_delta: sellingMonth,
        })),
      };

      await firstValueFrom(this.tradingCenterService.requestRollingDeal(this.indexDetails.id, payload));

      this.dialog.open(RequestPricingDialogComponent, {
        closeOnNavigation: true,
        disableClose: false,
        panelClass: 'rootModal',
        autoFocus: false,
      });
    } catch (e) {
      // Build API validation message for rendering
      const error = e as any;
      error.error.trade_requests.forEach((x: any) => Object.keys(x).forEach((key) => this.apiErrors.push(x[key][0])));
      // Remove duplicates from the API response
      this.apiErrors = Array.from(new Set(this.apiErrors));
      this.toastService.error(this.apiErrors.join('</br>'));
    }
  }

  private calculateStrikeAndLimitRatio(direction: OptionTypes) {
    const { minimum_call_strike_ratio, maximum_spread_ratio, maximum_put_strike_ratio, minimum_spread_ratio } =
      this.rollingDealConfig;
    if (direction === OptionTypes.Call) {
      this.strikeAndLimitRange = [
        minimum_call_strike_ratio * 100,
        (minimum_call_strike_ratio + maximum_spread_ratio) * 100,
      ];
      this.strikeAndLimitRatio = [
        minimum_call_strike_ratio * 100,
        (minimum_call_strike_ratio + minimum_spread_ratio) * 100,
      ];
    } else {
      this.strikeAndLimitRange = [0, maximum_put_strike_ratio * 100];
      this.strikeAndLimitRatio = [
        (maximum_put_strike_ratio - maximum_spread_ratio) * 100,
        maximum_put_strike_ratio * 100,
      ];
    }

    this.prevStrikeAndLimitRatio = this.strikeAndLimitRatio;
    this.cdr.detectChanges();
  }

  private loadSellingMonths(): void {
    const startingDelay = this.form.get('startingDelay')?.value;
    const duration = this.form.get('duration')?.value;

    this.sellingMonthsOptions = [
      ...Array(this.rollingDealConfig.last_available_expiration_length - startingDelay - duration).keys(),
    ].map((offset) => {
      return {
        label: getCoverageStart(offset + 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        id: offset + 1,
      };
    });
  }

  strikeAndLimitUpdate() {
    let { minimum_call_strike_ratio, maximum_spread_ratio, minimum_spread_ratio, maximum_put_strike_ratio } =
      this.rollingDealConfig;
    minimum_call_strike_ratio *= 100;
    maximum_spread_ratio *= 100;
    minimum_spread_ratio *= 100;
    maximum_put_strike_ratio *= 100;

    const direction = this.form.get('direction')?.value;
    let current = this.strikeAndLimitRatio;

    if (direction === OptionTypes.Call) {
      const lowerLimit = this.prevStrikeAndLimitRatio[0] + minimum_spread_ratio;
      if (current[0] !== this.prevStrikeAndLimitRatio[0]) {
        if (current[1] < current[0] + minimum_spread_ratio) {
          current[1] = current[0] + minimum_spread_ratio;
        }
      } else if (current[1] != this.prevStrikeAndLimitRatio[1] && current[1] < lowerLimit) {
        current[0] -= lowerLimit - current[1];
        if (current[0] < minimum_call_strike_ratio) {
          current = [minimum_call_strike_ratio, minimum_call_strike_ratio + minimum_spread_ratio];
        }
      }

      this.strikeAndLimitRange = [minimum_call_strike_ratio, current[0] + maximum_spread_ratio];
    } else if (direction === OptionTypes.Put) {
      if (current[1] !== this.prevStrikeAndLimitRatio[1]) {
        if (current[1] - current[0] < minimum_spread_ratio) {
          current[0] = current[1] - minimum_spread_ratio;
          if (current[0] < 0) {
            current = [0, minimum_spread_ratio];
          }
        } else if (current[1] - current[0] > maximum_spread_ratio) {
          current[0] = current[1] - maximum_spread_ratio;
        }
      } else if (current[0] !== this.prevStrikeAndLimitRatio[0]) {
        if (current[1] - current[0] > maximum_spread_ratio) {
          current[1] = current[0] + maximum_spread_ratio;
        } else if (current[1] - current[0] < minimum_spread_ratio) {
          current[1] = current[0] + minimum_spread_ratio;
        }

        if (current[1] > maximum_put_strike_ratio) {
          current = [maximum_put_strike_ratio - minimum_spread_ratio, maximum_put_strike_ratio];
        }
      }
    }

    this.strikeAndLimitRatio = current;
    this.prevStrikeAndLimitRatio = current;

    this.cdr.detectChanges();
  }
}
