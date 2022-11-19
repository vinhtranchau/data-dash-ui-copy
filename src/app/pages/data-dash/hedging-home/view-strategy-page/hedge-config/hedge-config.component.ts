import { Component, Input, OnInit } from '@angular/core';

import { HedgingControl } from '../../../../../core/models/hedging.model';

@Component({
  selector: 'dd-hedge-config',
  templateUrl: './hedge-config.component.html',
  styleUrls: ['./hedge-config.component.scss'],
})
export class HedgeConfigComponent implements OnInit {
  @Input() hedgeConfig: HedgingControl | undefined;
  @Input() isLoading = false;

  constructor() {}

  ngOnInit(): void {}
}
