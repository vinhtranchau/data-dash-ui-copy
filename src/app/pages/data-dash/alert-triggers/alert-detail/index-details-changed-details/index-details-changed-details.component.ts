import { Component, Input, OnInit } from '@angular/core';

import { AlertDetail, IndexDetailsChanged } from '../../../../../core/models/alert-trigger.model';
import { Index } from '../../../../../core/models/index.model';

@Component({
  selector: 'dd-index-details-changed-details',
  templateUrl: './index-details-changed-details.component.html',
  styleUrls: ['./index-details-changed-details.component.scss'],
})
export class IndexDetailsChangedDetailsComponent implements OnInit {
  @Input() alert: AlertDetail;
  extraData: IndexDetailsChanged;
  fields: (keyof Index)[];

  constructor() {}

  ngOnInit(): void {
    this.extraData = this.alert.extra_data as IndexDetailsChanged;
    this.fields = <(keyof Index)[]>Object.keys(this.extraData.old_data).filter((field) => {
      return !['last_updated_at', 'last_updated_by'].includes(field);
    });
  }
}
