import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';

import { DealDetail, GenerateStrategyPayload, HedgingControl } from '../../../../core/models/hedging.model';
import { HedgingService } from '../../../../core/services/hedging.service';
import { ToastService } from '../../../../ui-kit/toast/toast.service';

import { FinishDialogComponent } from './finish-dialog/finish-dialog.component';

@Component({
  selector: 'dd-generate-strategy-page',
  templateUrl: './generate-strategy-page.component.html',
  styleUrls: ['./generate-strategy-page.component.scss'],
})
export class GenerateStrategyPageComponent implements OnInit {
  indexUUID: string;
  isLoading = false;
  dealConfigForm: FormGroup | null;

  private hedgingControl: HedgingControl;

  constructor(private toast: ToastService, private hedgingService: HedgingService, private dialog: MatDialog) {}

  ngOnInit(): void {}

  async onGenerateHedgingStrategy(hedgingControl: HedgingControl) {
    try {
      this.isLoading = true;
      this.hedgingControl = hedgingControl;
      const deal_detail = this.dealConfigForm!.value as DealDetail;
      const payload: GenerateStrategyPayload = {
        index_details_id: this.indexUUID,
        deal_config: deal_detail,
        hedge_config: this.hedgingControl,
      };
      await firstValueFrom(this.hedgingService.generateStrategy(payload));
      this.finishProcess();
    } catch (e) {
      this.toast.error('Failed to generate a strategy. Please check with the admins.');
    } finally {
      this.isLoading = false;
    }
  }

  onChangeDealConfig(event: { dealConfigForm: FormGroup; indexUUID: string }) {
    const { dealConfigForm, indexUUID } = event;
    this.dealConfigForm = dealConfigForm;
    this.indexUUID = indexUUID;
  }

  private finishProcess() {
    this.dialog.open(FinishDialogComponent, {
      closeOnNavigation: true,
      disableClose: false,
      panelClass: 'rootModal',
      autoFocus: false,
    });
  }
}
