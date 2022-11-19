import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { IndexProvider } from '../models/index.model';

@Injectable({
  providedIn: 'root',
})
export class IndexProviderService {
  constructor(private http: HttpClient) {}

  getIndexProviders(): Observable<IndexProvider[]> {
    const url = `${environment.api}/miscellaneous/index_providers/`;
    return this.http.get<IndexProvider[]>(url);
  }

  createIndexProvider(payload: IndexProvider): Observable<IndexProvider> {
    const url = `${environment.api}/miscellaneous/index_providers/`;
    return this.http.post<IndexProvider>(url, payload);
  }

  updateIndexProvider(payload: IndexProvider): Observable<IndexProvider> {
    const url = `${environment.api}/miscellaneous/index_providers/${payload.id}/`;
    return this.http.patch<IndexProvider>(url, payload);
  }
}
