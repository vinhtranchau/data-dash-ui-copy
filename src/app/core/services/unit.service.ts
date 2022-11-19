import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Unit } from '../models/unit.model';

@Injectable({
  providedIn: 'root',
})
export class UnitService {
  constructor(private http: HttpClient) {}

  getUnits(): Observable<Unit[]> {
    // This api supports pagination but need to fetch all, so not sending any parameter
    const url = `${environment.api}/miscellaneous/units/`;
    return this.http.get<Unit[]>(url);
  }

  createUnit(payload: Unit): Observable<Unit> {
    const url = `${environment.api}/miscellaneous/units/`;
    return this.http.post<Unit>(url, payload);
  }

  updateUnit(payload: Unit): Observable<Unit> {
    const url = `${environment.api}/miscellaneous/units/${payload.id}/`;
    return this.http.patch<Unit>(url, payload);
  }
}
