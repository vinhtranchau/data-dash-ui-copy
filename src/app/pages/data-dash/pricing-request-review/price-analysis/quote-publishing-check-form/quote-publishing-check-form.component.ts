import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { QuotePublishingCheck } from '../../../../../core/models/rolling-deal.model';
import { RollingDealPortfolio } from '../../../../../core/models/trading-center.model';
import { PageType, Permission } from '../utils/price-analysis.util';

@Component({
  selector: 'dd-quote-publishing-check-form',
  templateUrl: './quote-publishing-check-form.component.html',
  styleUrls: ['./quote-publishing-check-form.component.scss'],
})
export class QuotePublishingCheckFormComponent implements OnInit {
  @Input() deal: RollingDealPortfolio;
  @Input() permission: Permission;

  @Output() updateQuotePublishingCheck: EventEmitter<QuotePublishingCheck> = new EventEmitter<QuotePublishingCheck>();
  @Output() sendQuoteToUW: EventEmitter<any> = new EventEmitter<any>();
  @Output() confirmQuote: EventEmitter<any> = new EventEmitter<any>();
  @Output() sendToCustomer: EventEmitter<any> = new EventEmitter<any>();
  @Output() uploadQuote: EventEmitter<any> = new EventEmitter<any>();

  PageType = PageType;

  form: FormGroup = this.fb.group({
    is_ds_check_passed: [false, Validators.requiredTrue],
    is_underwriter_check_passed: [false],
    is_sales_check_passed: [false],
  });

  constructor(private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    const { type } = this.permission;
    if (type === PageType.UW) {
      // If page is UW, then Data Science check box should be checked by default and can't be unchecked
      this.form.get('is_ds_check_passed')?.setValue(this.deal.is_ds_check_passed);
      this.form.get('is_ds_check_passed')?.disable();
      // UW page, all checks should be checked, adding validators
      this.form.get('is_underwriter_check_passed')?.setValidators(Validators.requiredTrue);
      this.form.get('is_underwriter_check_passed')?.setValue(this.deal.is_underwriter_check_passed);
      this.form.get('is_sales_check_passed')?.setValidators(Validators.requiredTrue);
      this.form.get('is_sales_check_passed')?.setValue(this.deal.is_sales_check_passed);
    }

    this.form.valueChanges.subscribe((value) => this.updateQuotePublishingCheck.emit(value));
  }
}
