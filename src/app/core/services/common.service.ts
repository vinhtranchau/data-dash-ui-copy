import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { standaloneModalRouteOutlet } from '../routes/standalone-modal.route';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor(private router: Router) {}

  openStandaloneModal(url: string, fullscreen: boolean = false) {
    if (!fullscreen) {
      this.router
        .navigate(['', { outlets: { [standaloneModalRouteOutlet]: url + '/modal' } }], {
          queryParamsHandling: 'merge',
        })
        .then();
    } else {
      window.open(url + '/fullscreen', '_blank');
    }
  }

  closeStandaloneModal() {
    this.router
      .navigate(['', { outlets: { [standaloneModalRouteOutlet]: null } }], {
        queryParamsHandling: 'merge',
      })
      .then();
  }
}
