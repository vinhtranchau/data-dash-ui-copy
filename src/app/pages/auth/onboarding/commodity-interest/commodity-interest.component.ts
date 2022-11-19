import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  UntypedFormArray,
  UntypedFormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import { CommodityInterest, Company } from '../../../../core/models/company.model';
import { ClassHierarchy } from '../../../../core/models/hierarchy.model';
import { CompanyService } from '../../../../core/services/company.service';
import { StoreService } from '../../../../core/services/store.service';
import { ToastService } from '../../../../ui-kit/toast/toast.service';

@Component({
  selector: 'dd-commodity-interest',
  templateUrl: './commodity-interest.component.html',
  styleUrls: ['./commodity-interest.component.scss'],
})
export class CommodityInterestComponent implements OnInit, OnDestroy {
  @Input() continueText: string = 'Finish!';
  @Output() nextStage: EventEmitter<boolean> = new EventEmitter<boolean>();

  private unsubscribeAll: Subject<any> = new Subject<any>();
  hierarchyOptions: ClassHierarchy[] = [];
  isLoading: boolean = true;
  company: Company;
  hasFreeTextField: boolean = false;

  getNewCommodity(commodity: string | null, buy: boolean, sell: boolean) {
    return this.fb.group({
      klass_id: [commodity],
      is_buy: [buy],
      is_sell: [sell],
    });
  }

  form: UntypedFormGroup = this.fb.group({ commodities: this.fb.array([]), freeTextField: '' });

  constructor(
    private fb: FormBuilder,
    public store: StoreService,
    private companyService: CompanyService,
    private toast: ToastService
  ) {}

  async ngOnInit() {
    this.isLoading = true;
    this.store.loadClasses();
    this.store.classes$.pipe(takeUntil(this.unsubscribeAll)).subscribe((hierarchies) => {
      this.hierarchyOptions = hierarchies
        .filter((item) => item.name !== 'ARCHIVED')
        .map((item) => {
          return {
            ...item,
            name: item.name.replace(
              // Title-case classes
              /\w\S*/g,
              function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
              }
            ),
          };
        });
    });

    this.company = await firstValueFrom(this.companyService.getCompany());

    let commodities: CommodityInterest[] = [];
    if (this.company) {
      commodities = await firstValueFrom(this.companyService.getCommodities());
      commodities.map((commodityInterest) => {
        if (commodityInterest.name) {
          this.hasFreeTextField = true;
          this.form.get('freeTextField')?.setValue(commodityInterest.name);
        } else {
          this.commodities.push(
            this.getNewCommodity(
              commodityInterest.klass_id || null,
              commodityInterest.is_buy || false,
              commodityInterest.is_sell || false
            )
          );
        }
      });
    }

    if (commodities.length < 3) {
      [...Array(3 - commodities.length).keys()].map((item) => {
        this.commodities.push(this.getNewCommodity(null, false, false));
      });
    }
    this.form.setValidators(this.checkDuplicateHierarchy());
    this.isLoading = false;
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }

  addCommodity() {
    this.commodities.push(this.getNewCommodity(null, false, false));
    setTimeout(() => {
      document.getElementById('commodity-' + (this.commodities.length - 1))!.scrollIntoView({
        behavior: 'smooth',
      });
    }, 300);
  }

  get commodities(): UntypedFormArray {
    return this.form.get('commodities') as UntypedFormArray;
  }

  async continue() {
    try {
      this.isLoading = true;
      const classList: string[] = [];
      const payload: CommodityInterest[] = this.form.value.commodities
        .filter((commodity: CommodityInterest) => {
          if (
            commodity.klass_id &&
            (commodity.is_buy || commodity.is_sell) &&
            !classList.includes(commodity.klass_id)
          ) {
            classList.push(commodity.klass_id);
            return true;
          } else {
            return false;
          }
        })
        .map((commodity: CommodityInterest) => {
          return commodity;
        });
      if (this.form.get('freeTextField')?.value) {
        payload.push({ name: this.form.get('freeTextField')!.value });
      }
      await firstValueFrom(this.companyService.setCommodities({ commodities: payload }));
      this.toast.success('Commodities saved successfully.');
      this.nextStage.emit(true);
    } catch (e) {
    } finally {
      this.isLoading = false;
    }
  }

  private checkDuplicateHierarchy(): ValidatorFn {
    return function (control: AbstractControl): ValidationErrors | null {
      const classes = control.value.commodities
        .filter((commodity: CommodityInterest) => commodity.klass_id)
        .map((commodity: CommodityInterest) => commodity.klass_id);
      if (new Set(classes).size !== classes.length) {
        // Check for duplicates
        return { duplicatedProducts: true };
      } else {
        return null;
      }
    };
  }
}
