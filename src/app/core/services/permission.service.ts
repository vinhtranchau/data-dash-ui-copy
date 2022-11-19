import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { HttpSuccessResponse } from '../models/common.model';
import { environment } from '../../../environments/environment';
import { Permission } from '../models/permission.model';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  constructor(private http: HttpClient) {}

  getPermissions(): Observable<Permission[]> {
    const url = `${environment.api}/group-permissions/`;
    return this.http.get<Permission[]>(url);
  }

  editPermission(payload: Permission): Observable<HttpSuccessResponse> {
    const url = `${environment.api}/group-permissions/${payload.id}/`;
    return this.http.put<HttpSuccessResponse>(url, payload);
  }

  createPermission(payload: Permission): Observable<HttpSuccessResponse> {
    const url = `${environment.api}/group-permissions/`;
    return this.http.post<HttpSuccessResponse>(url, payload);
  }
}
