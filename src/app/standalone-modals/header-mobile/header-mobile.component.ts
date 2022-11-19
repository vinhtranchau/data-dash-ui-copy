import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'dd-header-mobile',
  templateUrl: './header-mobile.component.html',
  styleUrls: ['./header-mobile.component.scss']
})
export class HeaderMobileComponent implements OnInit {
  @Input() title: string | undefined;

  constructor(
    public location: Location,
  ) {
  }

  ngOnInit(): void {
  }

}
