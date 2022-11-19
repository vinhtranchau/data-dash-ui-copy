import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { CommodityInterest, Company } from '../models/company.model';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  constructor(private http: HttpClient) {}

  getCompany(): Observable<Company> {
    const url = `${environment.api}/user/company/`;
    return this.http.get<Company>(url);
  }

  setCompany(company: Company): Observable<Company> {
    const url = `${environment.api}/user/company/save/`;
    return this.http.post<Company>(url, company);
  }

  getCommodities(): Observable<CommodityInterest[]> {
    const url = `${environment.api}/user/company/commodities/`;
    return this.http.get<CommodityInterest[]>(url).pipe(
      map((res) => {
        res = res.map((item) => ({
          ...item,
          klass_id: item.klass?.id,
        }));
        return res;
      })
    );
  }

  setCommodities(commodities: { commodities: CommodityInterest[] }): Observable<CommodityInterest[]> {
    const url = `${environment.api}/user/company/commodities/bulk_save/`;
    return this.http.post<CommodityInterest[]>(url, commodities);
  }
}
