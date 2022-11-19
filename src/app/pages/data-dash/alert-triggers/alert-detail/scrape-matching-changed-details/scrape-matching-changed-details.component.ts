import { Component, Input, OnInit } from '@angular/core';

import { AlertDetail, ScrapeMatchingChanged } from '../../../../../core/models/alert-trigger.model';

@Component({
  selector: 'dd-scrape-matching-changed-details',
  templateUrl: './scrape-matching-changed-details.component.html',
  styleUrls: ['./scrape-matching-changed-details.component.scss']
})
export class ScrapeMatchingChangedDetailsComponent implements OnInit {
  @Input() alert: AlertDetail;
  extraData: ScrapeMatchingChanged;

  constructor() { }

  ngOnInit(): void {
    this.extraData = this.alert.extra_data as ScrapeMatchingChanged;
  }

}
