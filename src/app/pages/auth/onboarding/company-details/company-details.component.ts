import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import { BusinessTypes, Company, turnOverOptions } from '../../../../core/models/company.model';
import { Nation } from '../../../../core/models/nation.model';
import { CompanyService } from '../../../../core/services/company.service';
import { StoreService } from '../../../../core/services/store.service';
import { CompanyForm, companyFormGroup } from '../../../../core/strict-typed-forms/auth.form';
import { enumToOptions } from '../../../../core/utils/enum.util';
import { ToastService } from '../../../../ui-kit/toast/toast.service';

@Component({
  selector: 'dd-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.scss'],
})
export class CompanyDetailsComponent implements OnInit, OnDestroy {
  @Input() continueText: string = 'Continue';
  @Output() nextStage: EventEmitter<boolean> = new EventEmitter<boolean>();

  private unsubscribeAll: Subject<any> = new Subject<any>();
  isLoading: boolean = false;
  businessTypeOptions = enumToOptions(BusinessTypes);
  turnOverOptions = turnOverOptions;
  form: FormGroup<CompanyForm> = this.fb.nonNullable.group({ ...companyFormGroup });
  nationOptions$: Nation[] = [];

  constructor(
    private fb: FormBuilder,
    public store: StoreService,
    private companyService: CompanyService,
    private toast: ToastService
  ) {}

  async ngOnInit() {
    this.store.loadNations();
    this.store.nations$.pipe(takeUntil(this.unsubscribeAll)).subscribe((nations) => {
      this.nationOptions$ = nations
        .map((item) => {
          return {
            ...item,
            name: item.name.replace(
              // Title-case products
              /\w\S*/g,
              function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
              }
            ),
          };
        });
    });
    const company = await firstValueFrom(this.companyService.getCompany());
    if (company) {
      this.form.get('name')?.setValue(company.name);
      this.form.get('city')?.setValue(company.city);
      this.form.get('country_id')?.setValue(company.country.id);
      this.form.get('business_type')?.setValue(company.business_type);
      this.form.get('turnover')?.setValue(company.turnover);
    }
  }

  async continue() {
    try {
      this.isLoading = true;
      await firstValueFrom(this.companyService.setCompany(this.form.value as Company));
      this.toast.success('Company information saved successfully.')
      this.nextStage.emit(true);
    } catch (e) {
    } finally {
      this.isLoading = false;
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }
}
