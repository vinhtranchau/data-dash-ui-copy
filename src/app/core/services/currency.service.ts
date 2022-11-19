import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Currency } from '../models/currency.model';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  constructor(private http: HttpClient) {}

  getCurrencies(): Observable<Currency[]> {
    // This api supports pagination but need to fetch all, so not sending any parameter
    const url = `${environment.api}/miscellaneous/currencies/`;
    return this.http.get<Currency[]>(url);
  }

  createCurrency(payload: Currency): Observable<Currency> {
    const url = `${environment.api}/miscellaneous/currencies/`;
    return this.http.post<Currency>(url, payload);
  }

  updateCurrency(payload: Currency): Observable<Currency> {
    const url = `${environment.api}/miscellaneous/currencies/${payload.id}/`;
    return this.http.patch<Currency>(url, payload);
  }
}
