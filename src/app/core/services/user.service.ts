import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { EditUserPayload, User } from '../models/user.model';
import { LoginResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    const url = `${environment.api}/admin/users/`;
    return this.http.get<User[]>(url).pipe(
      map((res) => {
        res = res.map((item) => ({
          ...item,
          permissions_name: item.permissions.permissions_group, // Only for rendering
          created_at: item.created_at ? new Date(item.created_at) : null,
        }));
        return res;
      })
    );
  }

  editUser(payload: EditUserPayload): Observable<LoginResponse> {
    const url = `${environment.api}/admin/users/${payload.id}/`;
    return this.http.patch<LoginResponse>(url, payload);
  }
}
