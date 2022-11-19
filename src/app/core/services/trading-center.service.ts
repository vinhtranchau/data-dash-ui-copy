import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  bidRequest,
  ClientIndex,
  ContractType,
  RollingDealPortfolio,
  RollingDealStatus,
  StatusType,
  SubmitRollingDeal,
  TradeRequest,
  TradingIndexCorrelationPair,
} from '../models/trading-center.model';
import { IndexPrice } from '../models/index.model';
import { PaginationResponseV2 } from '../models/common.model';
import { ContractConfigQuote } from '../strict-typed-forms/trading-center.form';
import { getDecimal, getPercentage } from '../utils/number.util';
import { getCurrencyAndUnit } from '../utils/index-detail.util';

@Injectable({
  providedIn: 'root',
})
export class TradingCenterService {
  constructor(private http: HttpClient) {}

  getIndexes(
    pageSize?: number | null,
    page?: number | null,
    classId?: string | null,
    favoriteOnly?: boolean,
    inHedgingBook?: boolean,
    isRollingDeal?: boolean
  ): Observable<ClientIndex[] | PaginationResponseV2<ClientIndex>> {
    let params: HttpParams = new HttpParams();

    if (page) {
      params = params.append('page', page);
    }

    if (pageSize) {
      params = params.append('page_size', pageSize);
    }
    if (classId) {
      params = params.append('product_id__class_hierarchy_id', classId);
    }

    if (favoriteOnly) {
      params = params.append('is_favorite_by_me', favoriteOnly);
    }

    const url = `${environment.api}/trading_center/indexes/`;
    return this.http.get<ClientIndex[] | PaginationResponseV2<ClientIndex>>(url, { params }).pipe(
      map((res) => {
        let results: ClientIndex[];
        if ('results' in res) {
          results = res.results;
        } else {
          results = res;
        }

        results = results.map((item) => ({
          ...item,
          product: item.product_id.name,
          index_provider: item.index_provider_id.name,
          last_index_price_units: `${getDecimal(item.last_index_price, 2)} ${item.currency_id.code} ${
            item.is_currency_cents ? '(Cents) ' : ''
          }/${item.unit_multiplier === 1 ? '' : ' ' + item.unit_multiplier} ${item.unit_id.units}`,
          last_price_movement: `${item.last_price_change > 0 ? '+' : ''}${getDecimal(
            item.last_price_change,
            2
          )} (${getPercentage(item.last_price_percentage_change, 2, false)})`,
        }));

        if ('results' in res) {
          res.results = results;
        } else {
          res = results;
        }
        return res;
      })
    );
  }

  getIndexDetails(indexId: string): Observable<ClientIndex> {
    const url = `${environment.api}/trading_center/indexes/${indexId}/`;
    return this.http.get<ClientIndex>(url).pipe(
      map((res) => {
        if (res.rolling_deal_config) {
          const {
            maximum_put_strike_ratio,
            minimum_call_strike_ratio,
            maximum_spread_ratio,
            minimum_spread_ratio,
            maximum_risk_capital_per_deal,
            maximum_risk_capital_per_index,
            minimum_risk_capital_per_deal,
          } = res.rolling_deal_config;
          res.rolling_deal_config = {
            ...res.rolling_deal_config,
            maximum_put_strike_ratio: Number(maximum_put_strike_ratio),
            minimum_call_strike_ratio: Number(minimum_call_strike_ratio),
            maximum_spread_ratio: Number(maximum_spread_ratio),
            minimum_spread_ratio: Number(minimum_spread_ratio),
            maximum_risk_capital_per_deal: Number(maximum_risk_capital_per_deal),
            maximum_risk_capital_per_index: Number(maximum_risk_capital_per_index),
            minimum_risk_capital_per_deal: Number(minimum_risk_capital_per_deal),
          };
        }
        return res;
      })
    );
  }

  getIndexPrice(indexId: string): Observable<IndexPrice[]> {
    const url = `${environment.api}/trading_center/indexes/${indexId}/prices/`;
    return this.http.get<IndexPrice[]>(url);
  }

  getCorrelatedIndexes(
    indexId: string,
    page = 1,
    pageSize = 5,
    contractType: ContractType
  ): Observable<PaginationResponseV2<TradingIndexCorrelationPair>> {
    const url = `${environment.api}/trading_center/indexes/${indexId}/correlated_indexes/`;
    let params = new HttpParams().append('page', page).append('page_size', pageSize);

    if (contractType == ContractType.Individual) {
      params = params.append('in_hedging_book', true);
    } else {
      params = params.append('is_rolling_deal', true);
    }
    return this.http.get<PaginationResponseV2<TradingIndexCorrelationPair>>(url, { params });
  }

  requestQuote(indexId: string, payload: ContractConfigQuote): Observable<TradeRequest> {
    const url = `${environment.api}/trading_center/indexes/${indexId}/request_trade/`;
    return this.http.post<TradeRequest>(url, payload);
  }

  getAllTradeRequest(
    pageSize: number,
    page: number,
    search: string,
    status: StatusType[],
    sic?: string | null
  ): Observable<PaginationResponseV2<TradeRequest>> {
    let params: HttpParams = new HttpParams()
      .append('page_size', pageSize)
      .append('page', page)
      .append('search', search)
      .append('status__in', status.join(','));

    // We can filter data by each field, but at the moment, just adding SIC filter only
    if (sic) {
      params = params.append('index__stable_index_code', sic);
    }

    const url = `${environment.api}/trading_center/trade_requests/`;
    return this.http.get<PaginationResponseV2<TradeRequest>>(url, { params }).pipe(
      map((res) => {
        res.results = res.results.map((item) => ({
          ...item,
          stable_index_code: item.index.stable_index_code,
          product: item.index.product_id.name,
          index_provider: item.index.index_provider_id.name,
          units_collated: `${getCurrencyAndUnit(item.index, false)}`,
          index_id: item.index.id,
          bid_price: item.bid?.price,
          bid_expiration_time: item.bid?.expiration_time,
          bid_filled_quantity: item.bid?.filled_quantity,
          bid_is_partial_execution_enabled: item.bid?.is_partial_execution_enabled,
        }));
        return res;
      })
    );
  }

  getTradeRequestStatistics(status: 'live' | 'settled' | 'live,settled'): Observable<any> {
    const url = `${environment.api}/trading_center/trade_requests/statistics/`;
    let params: HttpParams = new HttpParams();
    if (status === 'live,settled') {
      params = params.append('status__in', status);
    } else {
      params = params.append('status', status);
    }
    return this.http.get<any>(url, { params });
  }

  getTradeRequest(tradeId: string): Observable<TradeRequest> {
    const url = `${environment.api}/trading_center/trade_requests/${tradeId}/`;
    return this.http.get<TradeRequest>(url).pipe(
      map((res) => {
        res = {
          ...res,
          total_premiums: res.desired_quantity * parseFloat(res.premium || '0'),
          total_claims_paid: res.desired_quantity * parseFloat(res.claims_paid || '0'),
          bid_price: res.bid?.price,
          bid_expiration_time: res.bid?.expiration_time,
          bid_filled_quantity: res.bid?.filled_quantity,
          bid_is_partial_execution_enabled: res.bid?.is_partial_execution_enabled,
        };
        return res;
      })
    );
  }

  finishTradeRequest(
    tradeId: string,
    status: StatusType,
    desired_quantity: number,
    bid?: bidRequest
  ): Observable<TradeRequest> {
    const url = `${environment.api}/trading_center/trade_requests/${tradeId}/`;
    const payload = {
      status: status,
      desired_quantity: desired_quantity,
      bid: bid,
    };
    return this.http.patch<TradeRequest>(url, payload);
  }

  deleteTradeRequest(tradeId: string): Observable<null> {
    const url = `${environment.api}/trading_center/trade_requests/${tradeId}/cancel/`;
    return this.http.delete<null>(url);
  }

  pingTradingEngine() {
    const url = `${environment.api}/trading_center/trade_requests/ping_server/`;
    return this.http.get(url);
  }

  requestRollingDeal(indexId: string, payload: SubmitRollingDeal): Observable<SubmitRollingDeal> {
    const url = `${environment.api}/trading_center/indexes/${indexId}/request_deal/`;
    return this.http.post<SubmitRollingDeal>(url, payload);
  }

  getUWAllRollingDealRequests(
    pageSize: number,
    page: number,
    status: RollingDealStatus | null
  ): Observable<PaginationResponseV2<RollingDealPortfolio>> {
    let params: HttpParams = new HttpParams().append('is_ds_check_passed', true);

    if (status) {
      params = params.append('status__in', status);
    }

    return this.getRollingDealRequests(pageSize, page, params);
  }

  getDSRollingDealRequests(pageSize: number, page: number): Observable<PaginationResponseV2<RollingDealPortfolio>> {
    let params: HttpParams = new HttpParams()
      .append('is_ds_check_passed', false)
      .append(
        'status__in',
        [
          RollingDealStatus.FirmRequest,
          RollingDealStatus.IndicativeRequest,
          RollingDealStatus.IndicativeReprice,
          RollingDealStatus.FirmReprice,
        ].join(',')
      );

    return this.getRollingDealRequests(pageSize, page, params);
  }

  private getRollingDealRequests(
    pageSize: number,
    page: number,
    params: HttpParams
  ): Observable<PaginationResponseV2<RollingDealPortfolio>> {
    params = params.append('page_size', pageSize).append('page', page);
    const url = `${environment.api}/trading_center/trade_rolling_deals/`;
    return this.http.get<PaginationResponseV2<RollingDealPortfolio>>(url, { params });
  }

  getAllRollingDealRequest(
    pageSize: number,
    page: number,
    search: string,
    sic?: string | null
  ): Observable<PaginationResponseV2<RollingDealPortfolio>> {
    let params: HttpParams = new HttpParams()
      .append('page_size', pageSize)
      .append('page', page)
      .append('search', search);

    // We can filter data by each field, but at the moment, just adding SIC filter only
    if (sic) {
      params = params.append('trade_requests__index__stable_index_code', sic);
    }

    const url = `${environment.api}/trading_center/trade_rolling_deals/`;
    return this.http.get<PaginationResponseV2<RollingDealPortfolio>>(url, { params }).pipe(
      map((res) => {
        res.results = res.results.map((item) => ({
          ...item,
          selling_months_string: item.selling_months
            .map((month) => new Date(month).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }))
            .join(', '),
          stable_index_code: item.index.stable_index_code,
          product: item.index.product_id.name,
          index_provider: item.index.index_provider_id.name,
          units_collated: `${getCurrencyAndUnit(item.index, false)}`,
          index_id: item.index.id,
        }));
        return res;
      })
    );
  }
}
