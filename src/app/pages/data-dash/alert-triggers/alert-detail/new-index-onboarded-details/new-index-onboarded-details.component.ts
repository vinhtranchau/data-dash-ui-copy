import { Component, Input, OnInit } from '@angular/core';

import { AlertDetail } from '../../../../../core/models/alert-trigger.model';
import { standaloneModalRoute } from '../../../../../core/routes/standalone-modal.route';

@Component({
  selector: 'dd-new-index-onboarded-details',
  templateUrl: './new-index-onboarded-details.component.html',
  styleUrls: ['./new-index-onboarded-details.component.scss']
})
export class NewIndexOnboardedDetailsComponent implements OnInit {
  @Input() alert: AlertDetail;
  standaloneModalRoute = standaloneModalRoute;

  constructor() { }

  ngOnInit(): void {
  }

}
