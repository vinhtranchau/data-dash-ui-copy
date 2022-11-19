import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { addDays } from 'date-fns';

import { QuoteAnalysis } from '../../../../../core/models/rolling-deal.model';
import { PageType, Permission } from '../utils/price-analysis.util';

@Component({
  selector: 'dd-update-rolling-deal-dialog',
  templateUrl: './update-rolling-deal-dialog.component.html',
  styleUrls: ['./update-rolling-deal-dialog.component.scss'],
})
export class UpdateRollingDealDialogComponent implements OnInit {
  PageType = PageType;

  isLoading = false;
  form: FormGroup;
  pageType: PageType;

  private quote: QuoteAnalysis;

  constructor(
    private readonly fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { quote: QuoteAnalysis; permission: Permission },
    private dialog: MatDialogRef<UpdateRollingDealDialogComponent>
  ) {
    this.quote = this.data.quote;
    this.pageType = this.data.permission.type;
    this.form = this.fb.group({
      algo_premium_ratio: Math.round(this.quote.algo_premium_ratio * 100000) / 1000 || 0,
      ds_premium_adjustment: Math.round(this.quote.ds_premium_adjustment * 100000) / 1000 || 0,
      uw_premium_surcharge: Math.round(this.quote.uw_premium_surcharge * 100000) / 1000 || 0,
      commercial_discount: Math.round(this.quote.commercial_discount * 100000) / 1000 || 0,
      executable_volume: this.quote.executable_volume || 0,
      valid_from: [this.quote.valid_from || new Date(), Validators.required],
      valid_to: [this.quote.valid_to || addDays(new Date(), 14), Validators.required],
    });
  }

  ngOnInit(): void {}

  save() {
    const { algo_premium_ratio, ds_premium_adjustment, uw_premium_surcharge, commercial_discount } = this.form.value;
    this.dialog.close({
      ...this.form.value,
      algo_premium_ratio: algo_premium_ratio / 100,
      ds_premium_adjustment: ds_premium_adjustment / 100,
      uw_premium_surcharge: uw_premium_surcharge / 100,
      commercial_discount: commercial_discount / 100,
    });
  }
}
