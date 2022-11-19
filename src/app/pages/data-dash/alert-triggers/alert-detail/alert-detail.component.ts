import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';

import { AlertDetail, AlertExplanation, AlertType } from '../../../../core/models/alert-trigger.model';
import { standaloneModalRoute } from '../../../../core/routes/standalone-modal.route';
import { AlertTriggerService } from '../../../../core/services/alert-trigger.service';
export interface Section {
  name: string;
  updated: Date;
}

@Component({
  selector: 'dd-alert-detail',
  templateUrl: './alert-detail.component.html',
  styleUrls: ['./alert-detail.component.scss'],
})
export class AlertDetailComponent implements OnInit {
  AlertType = AlertType;
  AlertExplanation = AlertExplanation;
  alert: AlertDetail;
  standaloneModalRoute = standaloneModalRoute;

  constructor(@Inject(MAT_DIALOG_DATA) public alertId: string, private alertTriggerService: AlertTriggerService) {}

  async ngOnInit() {
    this.alert = await firstValueFrom(this.alertTriggerService.getAlertData(this.alertId));
  }
}
