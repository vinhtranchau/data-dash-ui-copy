import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

declare let pendo: any;

@Injectable({
  providedIn: 'root',
})
export class PendoService {
  constructor() {}

  initialise(userId: string, email: string, name: string, role: string): void {
    pendo.initialize({
      visitor: {
        id: userId,
        email: email,
        full_name: name,
        role: role,
      },
      account: {
        id: environment.pendo_env,
      },
    });
  }
}
