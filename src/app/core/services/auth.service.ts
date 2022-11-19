import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, firstValueFrom, map, Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { environment } from '../../../environments/environment';
import { HttpResponse, HttpSuccessResponse } from '../models/common.model';
import { LoginResponse, UserDetails, UserPermissions } from '../models/auth.model';
import { LocalStorageService } from './local-storage.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuthenticated = Boolean(this.localStorageService.getSession());
  isAuthenticated$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.isAuthenticated);

  user: UserDetails = this.localStorageService.getUser();
  user$: BehaviorSubject<UserDetails> = new BehaviorSubject<UserDetails>(this.user);

  redirectUrl = '';
  redirectUrl$: BehaviorSubject<string> = new BehaviorSubject<string>(this.redirectUrl);

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
    private router: Router,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {}

  // Helper function for login and validate email
  setAuthSession(res: LoginResponse) {
    this.localStorageService.setSession(res.access);
    this.localStorageService.setUser({
      id: res.id.toString(),
      name: res.name,
      email: res.email,
      avatar: res.avatar,
      is_2fa_enabled: res.is_2fa_enabled,
      is_trusted_user: res.is_trusted_user,
      is_onboarded_completely: res.is_onboarded_completely,
      has_sales_role: res.has_sales_role,
    });
    this.localStorageService.setPermissions({
      permissions: res.permissions,
    });
    this.isAuthenticated = true;
    this.isAuthenticated$.next(this.isAuthenticated);
    this.user = this.localStorageService.getUser();
    this.user$.next(this.user);
    return res;
  }

  login(email: string, password: string): Observable<LoginResponse | null> {
    const url = `${environment.api}/user/sign_in/`;
    return this.http.post<LoginResponse | null>(url, { email, password }).pipe(
      map((res) => {
        if (res !== null) {
          return this.setAuthSession(res);
        }
        return null;
      })
    );
  }

  logout() {
    this.dialog.closeAll();
    // Remove push notification endpoint
    this.removeNotificationEndpoint(this.localStorageService.getNotificationEndpoint());
    this.localStorageService.killSession();
    this.isAuthenticated = false;
    this.isAuthenticated$.next(this.isAuthenticated);
    this.redirectUrl = '';
    this.redirectUrl$.next(this.redirectUrl);
    this.router.navigate(['/login']).then();
  }

  register(
    name: string,
    email: string,
    password: string,
    magicCode: string | undefined
  ): Observable<HttpSuccessResponse> {
    const url = `${environment.api}/user/sign_up/`;
    return this.http.post<HttpSuccessResponse>(url, { name, email, password, magic_code: magicCode });
  }

  validateEmail(code: string): Observable<LoginResponse> {
    const url = `${environment.api}/user/verify_email/`;
    return this.http.post<LoginResponse>(url, { code }).pipe(
      map((res) => {
        return this.setAuthSession(res);
      })
    );
  }

  validate2FA(code: string): Observable<LoginResponse> {
    const url = `${environment.api}/user/confirm_authorization/`;
    return this.http.post<LoginResponse>(url, { code }).pipe(
      map((res) => {
        return this.setAuthSession(res);
      })
    );
  }

  resendValidationEmail(email: string): Observable<HttpSuccessResponse> {
    const url = `${environment.api}/user/resend_email_verification/`;
    return this.http.post<HttpSuccessResponse>(url, { email });
  }

  sendResetPasswordLink(email: string, password: string): Observable<HttpSuccessResponse> {
    const url = `${environment.api}/user/reset_password/`;
    const payload = { email, new_password: password };
    return this.http.post<HttpSuccessResponse>(url, payload);
  }

  confirmResetPassword(code: string): Observable<HttpSuccessResponse> {
    const url = `${environment.api}/user/confirm_reset_password/`;
    return this.http.post<HttpSuccessResponse>(url, { code });
  }

  refreshPermissions(): Observable<UserPermissions> {
    const url = `${environment.api}/user/permissions/`;
    return this.http.get<UserPermissions>(url).pipe(
      map((res) => {
        this.localStorageService.setPermissions(res);
        return res;
      })
    );
  }

  changePassword(current_password: string, new_password: string): Observable<HttpResponse<any>> {
    const url = `${environment.api}/user/change_password/`;
    return this.http.post<HttpResponse<any>>(url, { current_password, new_password });
  }

  changeAvatar(formData: any): Observable<LoginResponse> {
    const url = `${environment.api}/user/change_avatar/`;
    return this.http.post<LoginResponse>(url, formData);
  }

  userUpdate(body: { name?: string; is_2fa_enabled?: boolean }): Observable<HttpResponse<any>> {
    const url = `${environment.api}/user/update_user/`;
    return this.http.patch<HttpResponse<any>>(url, body);
  }

  async removeNotificationEndpoint(endpoint: string) {
    if (environment.vapid_public_key && this.isAuthenticated && endpoint) {
      try {
        await firstValueFrom(this.notificationService.removeSubscription(endpoint)).then();
      } catch (e) {}
    }
  }
}
