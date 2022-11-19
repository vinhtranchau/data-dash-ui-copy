import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ChangeLogItems } from '../models/change-log.model';

@Injectable({
  providedIn: 'root',
})
export class ChangeLogService {
  constructor(private http: HttpClient) {}

  getChangeLog(): Observable<ChangeLogItems[]> {
    const url = `${environment.api}/change_log/`;
    return this.http.get<ChangeLogItems[]>(url);
  }
}
