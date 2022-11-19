import { Pipe, PipeTransform } from '@angular/core';
import { RollingDealPortfolio, RollingDealStatus } from '../../../core/models/trading-center.model';

@Pipe({
  name: 'isViewQuote',
})
export class IsViewQuotePipe implements PipeTransform {
  transform(deal: RollingDealPortfolio): boolean {
    const { status } = deal;
    return (
      status === RollingDealStatus.FirmAccepted ||
      status === RollingDealStatus.FirmExecuted ||
      status === RollingDealStatus.Live ||
      status === RollingDealStatus.Expired
    );
  }
}
