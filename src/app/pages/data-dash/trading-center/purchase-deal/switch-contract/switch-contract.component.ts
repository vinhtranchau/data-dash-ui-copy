import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ClientIndex, ContractType } from '../../../../../core/models/trading-center.model';
import { dataDashRoute } from '../../../../../core/routes/data-dash.route';

@Component({
  selector: 'dd-switch-contract',
  templateUrl: './switch-contract.component.html',
  styleUrls: ['./switch-contract.component.scss'],
})
export class SwitchContractComponent implements OnInit {
  @Input() startingContractType: ContractType = ContractType.Individual;
  @Input() indexDetails: ClientIndex;

  dataDashRoute = dataDashRoute;

  form: UntypedFormGroup = this.fb.group({
    contractType: [this.startingContractType],
  });

  contractType = ContractType;
  contractOptions: ContractType[] = [];

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.form.get('contractType')?.setValue(this.startingContractType);
    if (this.indexDetails.in_hedging_book) {
      this.contractOptions.push(this.contractType.Individual);
    }
    if (this.indexDetails.is_rolling_deal) {
      this.contractOptions.push(this.contractType.RollingDeal);
    }

    this.form.get('contractType')?.valueChanges.subscribe((contractType) => {
      // Dummy route needed to refresh oninit as we are navigating to the same page
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([
          '/' + dataDashRoute.root,
          dataDashRoute.tradingCenter,
          'trade',
          this.indexDetails.id,
          contractType,
        ]);
      });
    });
  }
}
