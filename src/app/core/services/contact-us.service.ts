import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ContactUsMessage } from '../models/contact-us.model';

@Injectable({
  providedIn: 'root',
})
export class ContactUsService {
  constructor(private http: HttpClient) {}

  submitMessage(payload: ContactUsMessage): Observable<null> {
    const url = `${environment.api}/contact_us/`;
    return this.http.post<null>(url, payload);
  }
}
