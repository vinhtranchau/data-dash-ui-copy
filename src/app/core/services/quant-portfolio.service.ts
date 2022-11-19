import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { PaginationResponseV2 } from '../models/common.model';
import { QuantPortfolio, QuantPortfolioPrice } from '../models/quant-portfolio.model';
import { getPercentage } from '../utils/number.util';

@Injectable({
  providedIn: 'root',
})
export class QuantPortfolioService {
  constructor(private http: HttpClient) {}

  getQuantPortfolio(page?: number, pageSize?: number): Observable<PaginationResponseV2<QuantPortfolio>> {
    const url = `${environment.api}/quant/portfolio/`;
    let params = new HttpParams();
    if (page && pageSize) {
      params = params.append('page', page).append('page_size', pageSize);
    }
    return this.http.get<PaginationResponseV2<QuantPortfolio>>(url, { params }).pipe(
      map((res) => {
        res.results = res.results.map((item) => ({
          ...item,
          price_change_text: getPercentage(item.price_change_percentage, 3, true),
        }));
        return res;
      })
    );
  }

  getQuantPortfolioPrice(uuid: string): Observable<QuantPortfolioPrice[]> {
    const url = `${environment.api}/quant/portfolio/${uuid}/prices/`;
    return this.http.get<QuantPortfolioPrice[]>(url);
  }
}
