import { Component, OnInit } from '@angular/core';

import { LocalStorageService } from '../../../core/services/local-storage.service';

@Component({
  selector: 'dd-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent implements OnInit {
  isTrustedUser: boolean = false;

  constructor(
    private localStorageService: LocalStorageService,
  ) {}

  ngOnInit(): void {
    this.isTrustedUser = this.localStorageService.getUser().is_trusted_user || false;
  }
}
