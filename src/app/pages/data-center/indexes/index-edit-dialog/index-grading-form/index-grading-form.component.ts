import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

import { enumToOptions } from '../../../../../core/utils/enum.util';
import { IndexState, IndexType, Tier, UnderwriterApproval } from '../../../../../core/models/index.model';
import { booleanOptions } from '../../../../../core/models/option.model';

@Component({
  selector: 'dd-index-grading-form',
  templateUrl: './index-grading-form.component.html',
  styleUrls: ['./index-grading-form.component.scss'],
})
export class IndexGradingFormComponent implements OnInit {
  @Input() form: UntypedFormGroup;

  indexStateOptions = enumToOptions(IndexState);
  indexTypeOptions = enumToOptions(IndexType);
  tierOptions = enumToOptions(Tier);
  underwriterApprovalOptions = enumToOptions(UnderwriterApproval);
  LivePricingAllowedOptions = booleanOptions;

  constructor() {
  }

  ngOnInit(): void {
  }
}
