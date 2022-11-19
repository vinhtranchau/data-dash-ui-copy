import { Pipe, PipeTransform } from '@angular/core';
import { RollingDealPortfolio, RollingDealStatus } from '../../../../../core/models/trading-center.model';

@Pipe({
  name: 'uwDisabled',
})
export class UwDisabledPipe implements PipeTransform {
  transform(deal: RollingDealPortfolio): boolean {
    return !Boolean(
      deal.status === RollingDealStatus.IndicativeRequest ||
        deal.status === RollingDealStatus.FirmRequest ||
        deal.status === RollingDealStatus.IndicativeReprice ||
        deal.status === RollingDealStatus.FirmReprice
    );
  }
}
