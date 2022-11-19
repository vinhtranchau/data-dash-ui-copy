import { Component, Input, OnInit } from '@angular/core';

import { DealDetail } from '../../../../../core/models/hedging.model';

@Component({
  selector: 'dd-deal-config',
  templateUrl: './deal-config.component.html',
  styleUrls: ['./deal-config.component.scss'],
})
export class DealConfigComponent implements OnInit {
  @Input() dealConfig: DealDetail | undefined;
  @Input() isLoading = false;

  constructor() {}

  ngOnInit(): void {}
}
