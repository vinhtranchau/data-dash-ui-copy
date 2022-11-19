import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../../../core/services/local-storage.service';

@Component({
  selector: 'dd-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  constructor(public localStorageService: LocalStorageService) {}

  ngOnInit(): void {}
}
