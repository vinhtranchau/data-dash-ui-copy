import { Component, Input, OnInit } from '@angular/core';

import { AlertDetail, ScrapeMatchingDeleted } from '../../../../../core/models/alert-trigger.model';

@Component({
  selector: 'dd-scrape-matching-deleted-details',
  templateUrl: './scrape-matching-deleted-details.component.html',
  styleUrls: ['./scrape-matching-deleted-details.component.scss']
})
export class ScrapeMatchingDeletedDetailsComponent implements OnInit {
  @Input() alert: AlertDetail;
  extraData: ScrapeMatchingDeleted;

  constructor() { }

  ngOnInit(): void {
    this.extraData = this.alert.extra_data as ScrapeMatchingDeleted;
  }

}
