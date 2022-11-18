import { Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { firstValueFrom, interval, Subject, takeUntil } from 'rxjs';

import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'dd-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  hasUpdate = false;

  private hasUpdate$: Subject<any> = new Subject<any>();

  constructor(
    private swUpdate: SwUpdate,
    private authService: AuthService,
  ) {}

  async ngOnInit() {
    if (this.authService.isAuthenticated) {
      try {
        await firstValueFrom(this.authService.refreshPermissions());
      } catch (err) {}
    }
    // Check for platform update
    if (this.swUpdate.isEnabled) {
      interval(30000)
        .pipe(takeUntil(this.hasUpdate$))
        .subscribe(() => {
          this.swUpdate.checkForUpdate().then((hasUpdate) => {
            if (hasUpdate) {
              this.hasUpdate = true;
              this.hasUpdate$.next(true);
            }
          });
        });
    }
  }

  async reload() {
    this.hasUpdate = false;
    location.reload();
  }
}
