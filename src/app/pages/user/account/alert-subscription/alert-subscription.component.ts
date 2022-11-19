import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormGroup } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import {
  AlertExplanation,
  AlertSubscription,
  AlertSubscriptionObjects,
  AlertType,
} from '../../../../core/models/alert-trigger.model';
import { NotificationService } from '../../../../core/services/notification.service';
import { StoreService } from '../../../../core/services/store.service';
import { ToastService } from '../../../../ui-kit/toast/toast.service';

@Component({
  selector: 'dd-alert-subscription',
  templateUrl: './alert-subscription.component.html',
  styleUrls: ['./alert-subscription.component.scss'],
})
export class AlertSubscriptionComponent implements OnInit {
  alertSubscriptionObjects = AlertSubscriptionObjects;
  alertExplanation = AlertExplanation;
  alertType = Object.values(AlertType);
  formGroup: { [alertType in AlertType]: boolean } = {
    [AlertType.ALERT_TYPE_ABNORMAL_PRICE_MOVEMENT]: false,
    [AlertType.ALERT_TYPE_HISTORICAL_PRICE_CORRECTION]: false,
    [AlertType.ALERT_TYPE_INDEX_DETAILS_CHANGED]: false,
    [AlertType.ALERT_TYPE_MISSING_PRICE_UPDATE]: false,
    [AlertType.ALERT_TYPE_NEW_INDEX_ONBOARDED]: false,
    [AlertType.ALERT_TYPE_SCRAPE_MATCHING_CHANGED]: false,
    [AlertType.ALERT_TYPE_SCRAPE_MATCHING_DELETED]: false,
  };
  form: UntypedFormGroup = this.fb.group({
    ...this.formGroup,
    all_indexes: true,
    [AlertSubscriptionObjects.IndexDetails]: [],
    [AlertSubscriptionObjects.ProductHierarchy]: [],
  });

  constructor(
    private fb: FormBuilder,
    public storeService: StoreService,
    private notificationService: NotificationService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.storeService.loadIndexUUIDs();
    this.storeService.loadHierarchies();
    this.loadPreferences();
  }

  async loadPreferences() {
    const res = await firstValueFrom(this.notificationService.getIndexAlertSubscriptions());
    if (res.length) {
      const alerts = res.map((el) => el.alert_types).flat();
      const indexDetailsObjectIds = [];
      const productHierarchyObjectIds = [];
      for (let el of res) {
        if (el.object_model === AlertSubscriptionObjects.IndexDetails.replace('-', '.')) {
          indexDetailsObjectIds.push(...(el.object_ids || []));
        }
        if (el.object_model === AlertSubscriptionObjects.ProductHierarchy.replace('-', '.')) {
          productHierarchyObjectIds.push(...(el.object_ids || []));
        }
      }
      alerts.map((alert) => {
        this.form.get(alert)?.setValue(true);
      });
      if (indexDetailsObjectIds.length || productHierarchyObjectIds.length) {
        this.form.get('all_indexes')?.setValue(false);
        this.form.get(AlertSubscriptionObjects.IndexDetails)?.setValue(indexDetailsObjectIds);
        this.form.get(AlertSubscriptionObjects.ProductHierarchy)?.setValue(productHierarchyObjectIds);
      }
    }
  }

  async submit() {
    try {
      const alerts = [];
      for (let alert of this.alertType) {
        if (this.form.get(alert)?.value) {
          alerts.push(alert);
        }
      }
      const payload: AlertSubscription[] = [];
      if (alerts.length) {
        if (this.form.get('all_indexes')?.value) {
          payload.push({
            alert_types: alerts,
          });
        } else {
          if ((this.form.get(AlertSubscriptionObjects.IndexDetails)?.value || []).length) {
            payload.push({
              alert_types: alerts,
              object_model: AlertSubscriptionObjects.IndexDetails.replace('-', '.'),
              object_ids: this.form.get(AlertSubscriptionObjects.IndexDetails)?.value || [],
            });
          }
          if ((this.form.get(AlertSubscriptionObjects.ProductHierarchy)?.value || []).length) {
            payload.push({
              alert_types: alerts,
              object_model: AlertSubscriptionObjects.ProductHierarchy.replace('-', '.'),
              object_ids: this.form.get(AlertSubscriptionObjects.ProductHierarchy)?.value || [],
            });
          }
          if (alerts.includes(AlertType.ALERT_TYPE_NEW_INDEX_ONBOARDED)) {
            payload.push({
              alert_types: [AlertType.ALERT_TYPE_NEW_INDEX_ONBOARDED],
            });
          }
        }
      }

      await firstValueFrom(this.notificationService.subscribeIndexAlerts(payload));
      this.toast.success('Subscription preferences have been saved.');
    } catch (e) {
      this.toast.error('Something went wrong! Try again or report the problem.');
    } finally {
    }
  }
}
