import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Nation } from '../models/nation.model';

@Injectable({
  providedIn: 'root',
})
export class NationService {
  constructor(private http: HttpClient) {}

  getNations(): Observable<Nation[]> {
    // This api supports pagination but need to fetch all, so not sending any parameter
    const url = `${environment.api}/miscellaneous/nations/`;
    return this.http.get<Nation[]>(url);
  }

  createNation(payload: Nation): Observable<Nation> {
    const url = `${environment.api}/miscellaneous/nations/`;
    return this.http.post<Nation>(url, payload);
  }

  updateNation(payload: Nation): Observable<Nation> {
    const url = `${environment.api}/miscellaneous/nations/${payload.id}/`;
    return this.http.patch<Nation>(url, payload);
  }
}
