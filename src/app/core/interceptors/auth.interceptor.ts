import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

import { LocalStorageService } from '../services/local-storage.service';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../../ui-kit/toast/toast.service';
import { ToastPriority, ToastType } from '../../ui-kit/toast/toast.model';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private localStorageService: LocalStorageService,
    private authService: AuthService,
    private toast: ToastService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.localStorageService.getSession();
    const duplicate = request.clone({
      headers: request.headers.set('Authorization', `Bearer ${token}`),
    });
    return next.handle(duplicate).pipe(
      catchError((err) => {
        if (err.status === 401) {
          // Not authenticated
          this.toast.stream$.next({
            type: ToastType.Error,
            message: 'Credentials has expired, please log in again.',
            priority: ToastPriority.High,
          });
          this.authService.logout();
        } else if (err.status === 403) {
          // Invalid permissions
          this.toast.stream$.next({
            type: ToastType.Error,
            message: 'Credentials has been changed, please log in again.',
            priority: ToastPriority.High,
          });
          this.authService.logout();
        }
        return throwError(err);
      })
    );
  }
}
