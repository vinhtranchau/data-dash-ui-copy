import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable } from 'rxjs';

import { LocalStorageService } from './local-storage.service';
import { environment } from '../../../environments/environment';
import { UserPermissions } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated = Boolean(this.localStorageService.getSession());
  isAuthenticated$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.isAuthenticated);

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
  ) { }

  refreshPermissions(): Observable<UserPermissions> {
    const url = `${environment.api}/user/permissions/`;
    return this.http.get<UserPermissions>(url).pipe(
      map((res) => {
        this.localStorageService.setPermissions(res);
        return res;
      })
    );
  }
}
