import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ApiKey, ApiKeyPermission } from '../models/api-key.model';

@Injectable({
  providedIn: 'root',
})
export class ApiKeyService {
  constructor(private http: HttpClient) {}

  getApiKeys(): Observable<ApiKey[]> {
    const url = `${environment.api}/dd_api_keys/`;
    return this.http.get<ApiKey[]>(url);
  }

  permissionsList(): Observable<ApiKeyPermission[]> {
    const url = `${environment.api}/dd_api_routes/`;
    return this.http.get<ApiKeyPermission[]>(url);
  }

  createApiKey(payload: ApiKey): Observable<null> {
    const url = `${environment.api}/dd_api_keys/`;
    return this.http.post<null>(url, payload);
  }

  editApiKey(id: string, payload: ApiKey): Observable<null> {
    const url = `${environment.api}/dd_api_keys/${id}/create_or_update/`;
    return this.http.patch<null>(url, payload);
  }
}
