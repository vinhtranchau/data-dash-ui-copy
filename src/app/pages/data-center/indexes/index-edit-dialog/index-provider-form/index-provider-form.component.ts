import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

import { StoreService } from '../../../../../core/services/store.service';
import { accessDataOptions, PriceUpdateType, priceUpdateTypeLabels } from '../../../../../core/models/index.model';
import { enumToOptions } from '../../../../../core/utils/enum.util';

@Component({
  selector: 'dd-index-provider-form',
  templateUrl: './index-provider-form.component.html',
  styleUrls: ['./index-provider-form.component.scss'],
})
export class IndexProviderFormComponent implements OnInit {
  @Input() form: UntypedFormGroup;

  accessDataOptions = accessDataOptions;
  priceUpdateTypeOptions = enumToOptions(PriceUpdateType, priceUpdateTypeLabels);
  indexProviders$ = this.store.indexProviders$;

  constructor(private store: StoreService) {
  }

  ngOnInit(): void {
  }
}
