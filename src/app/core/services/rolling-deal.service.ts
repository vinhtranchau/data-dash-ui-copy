import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { saveAs } from 'file-saver';

import { environment } from '../../../environments/environment';
import { RollingDealPortfolio } from '../models/trading-center.model';
import { QuoteAnalysis, UpdateRollingDealRequest } from '../models/rolling-deal.model';

@Injectable({
  providedIn: 'root',
})
export class RollingDealService {
  constructor(private http: HttpClient) {}

  getRollingDealById(id: string): Observable<RollingDealPortfolio> {
    const url = `${environment.api}/trading_center/trade_rolling_deals/${id}/`;

    return this.http.get<RollingDealPortfolio>(url);
  }

  getQuoteAnalysis(id: string): Observable<QuoteAnalysis> {
    const url = `${environment.api}/trading_center/trade_rolling_deals/${id}/quote_analysis/`;
    return this.http.get<QuoteAnalysis>(url);
  }

  markDealDSPassed(id: string) {
    const url = `${environment.api}/trading_center/trade_rolling_deals/${id}/mark_deal_ds_passed/`;
    return this.http.post(url, null);
  }

  updateRollingDeal(id: string, payload: UpdateRollingDealRequest) {
    payload = {
      ...payload,
      algo_premium_ratio: Math.round(payload.algo_premium_ratio * 100000) / 100000,
      ds_premium_adjustment: Math.round(payload.ds_premium_adjustment * 100000) / 100000,
      commercial_discount: Math.round(payload.commercial_discount * 100000) / 100000,
      uw_premium_surcharge: Math.round(payload.uw_premium_surcharge * 100000) / 100000,
      executable_volume: Math.round(payload.executable_volume * 100000) / 100000,
    };

    const url = `${environment.api}/trading_center/trade_rolling_deals/${id}/`;
    return this.http.patch(url, payload);
  }

  downloadDealData(id: string) {
    const url = `${environment.api}/trading_center/trade_rolling_deals/${id}/download_deal_data/`;
    return this.http.post<string>(url, null).pipe(
      map((res) => new Blob([res], { type: 'text/csv' })),
      map((blob) => {
        saveAs(blob, 'Deal.csv');
      })
    );
  }

  uploadQuote(id: string, file: any) {
    const payload = new FormData();
    payload.append('quote', file);
    const url = `${environment.api}/trading_center/trade_rolling_deals/${id}/upload_quote/`;
    return this.http.post(url, payload);
  }

  sendToCustomer(id: string) {
    const url = `${environment.api}/trading_center/trade_rolling_deals/${id}/send_to_customer/`;
    return this.http.post(url, null);
  }

  initiateFirmDeal(id: string) {
    const url = `${environment.api}/trading_center/trade_rolling_deals/${id}/initiate_firm_deal/`;
    return this.http.post(url, null);
  }

  repriceIndicativeDeal(id: string, reject_reason: string) {
    const url = `${environment.api}/trading_center/trade_rolling_deals/${id}/reprice_indicative_deal/`;
    const payload = { reject_reason };
    return this.http.post(url, payload);
  }

  acceptFirmDeal(id: string) {
    const url = `${environment.api}/trading_center/trade_rolling_deals/${id}/accept_firm_deal/`;
    return this.http.post(url, null);
  }

  rejectFirmDeal(id: string, reject_reason: string) {
    const url = `${environment.api}/trading_center/trade_rolling_deals/${id}/reject_firm_deal/`;
    const payload = { reject_reason };
    return this.http.post(url, payload);
  }
}
