import { Component, OnInit } from '@angular/core';
import { dataDashRoute } from '../../../../core/routes/data-dash.route';
import { userRoute } from '../../../../core/routes/user.route';

import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'dd-profile-menu',
  templateUrl: './profile-menu.component.html',
  styleUrls: ['./profile-menu.component.scss'],
})
export class ProfileMenuComponent implements OnInit {
  user$ = this.authService.user$;
  userRoute = userRoute;
  dataDashRoute = dataDashRoute;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  logout() {
    this.authService.logout();
  }
}
