import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { GeneratedStrategies, GenerateStrategyPayload, HedgingStrategyDetail, Position } from '../models/hedging.model';

@Injectable({
  providedIn: 'root',
})
export class HedgingService {
  constructor(private http: HttpClient) {}

  getPositionList(): Observable<Position[]> {
    const url = `${environment.api}/quant/hedging/position-list/`;
    return this.http.get<Position[]>(url);
  }

  generateStrategy(payload: GenerateStrategyPayload): Observable<null> {
    const url = `${environment.api}/quant/hedging/generate-strategy/`;
    return this.http.post<null>(url, payload);
  }

  getStrategies(strategy_id: string): Observable<GeneratedStrategies> {
    const url = `${environment.api}/quant/hedging/fetch-strategy/`;
    const params = new HttpParams().append('strategy_id', strategy_id);
    return this.http.get<GeneratedStrategies>(url, { params }).pipe(
      map((res) => {
        res.hedging_strategies = res.hedging_strategies.map((hedge_strategy) => ({
          ...hedge_strategy,
          bid_ask: `${hedge_strategy.bid} - ${hedge_strategy.ask}`,
          effectiveness: `${hedge_strategy.hedging_effectiveness_low} - ${hedge_strategy.hedging_effectiveness_mean} - ${hedge_strategy.hedging_effectiveness_high}`,
        }));
        return res;
      })
    );
  }

  getStrategyDetail(hedging_id: string): Observable<HedgingStrategyDetail> {
    const url = `${environment.api}/quant/hedging/strategies-detail/`;
    const params = new HttpParams().append('hedging_id', hedging_id);
    return this.http.get<HedgingStrategyDetail>(url, { params });
  }
}
