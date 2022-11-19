import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  Forecast,
  FutureGroup,
  History,
  HistoryType,
  OrderBookInfo,
  OrderBookTradePlot,
  Plot,
  SgEng,
  Side,
} from '../models/quant.model';
import { PaginationResponseV2 } from '../models/common.model';

@Injectable({
  providedIn: 'root',
})
export class QuantService {
  constructor(private http: HttpClient) {}

  getInstrumentFuts(): Observable<FutureGroup[]> {
    const url = `${environment.api}/quant/instrument-futs-latest`;
    return this.http.get<FutureGroup[]>(url);
  }

  getInstrumentFutsPlot(futuresCode: string, deliveryMonth: string): Observable<Plot> {
    const url = `${environment.api}/quant/instrument-futs-plot`;
    const params = new HttpParams().append('futures_code', futuresCode).append('delivery_month', deliveryMonth);
    return this.http.get<Plot>(url, { params });
  }

  getInstrumentFutsForecast(
    futuresCode: string,
    sgEng: SgEng,
    basePrice: number,
    lenPath = 150
  ): Observable<Forecast[]> {
    const url = `${environment.api}/quant/instrument-futs-fcst`;
    const params = new HttpParams()
      .append('futures_code', futuresCode)
      .append('sg_eng', sgEng)
      .append('len_path', lenPath)
      .append('base_price', basePrice);
    return this.http.get<Forecast[]>(url, { params });
  }

  getOrderBookTradeInformation(futuresCode: string, deliveryMonth: string): Observable<OrderBookInfo> {
    const url = `${environment.api}/quant/trade/order-book-trade`;
    const params = new HttpParams().append('futures_code', futuresCode).append('delivery_month', deliveryMonth);
    return this.http.get<OrderBookInfo>(url, { params });
  }

  getOrderBookTradePlot(): Observable<OrderBookTradePlot> {
    const url = `${environment.api}/quant/trade/order-book-trade-plot`;
    return this.http.get<OrderBookTradePlot>(url);
  }

  getOrderTradeList(
    page = 1,
    pageSize = 10,
    dataType: HistoryType = HistoryType.TradeHistory
  ): Observable<PaginationResponseV2<History>> {
    const url = `${environment.api}/quant/order-trade-list`;
    const params = new HttpParams().append('page', page).append('page_size', pageSize).append('data_type', dataType);
    return this.http.get<PaginationResponseV2<History>>(url, { params });
  }

  trade(
    futures_code: string,
    delivery_month: string,
    price: number,
    quantity: number,
    stop: number,
    limit: number,
    side: Side
  ) {
    const url = `${environment.api}/quant/derivative-trade/`;
    return this.http.post(url, { futures_code, delivery_month, price, stop, limit, quantity, side });
  }
}
