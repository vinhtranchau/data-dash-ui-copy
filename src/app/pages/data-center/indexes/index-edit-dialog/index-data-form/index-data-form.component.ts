import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { StoreService } from '../../../../../core/services/store.service';
import { indexBundleFormulaFormGroup } from '../index-edit-form.config';
import {
  BundleFormulaFormGroup,
  Index,
  IndexUUID,
  PriceFrequency,
  ProxyType,
  PublishingDelayUnit,
} from '../../../../../core/models/index.model';
import { getBundleFormulaExpression } from '../../../../../core/utils/index-detail.util';
import { enumToOptions } from '../../../../../core/utils/enum.util';

@Component({
  selector: 'dd-index-data-form',
  templateUrl: './index-data-form.component.html',
  styleUrls: ['./index-data-form.component.scss'],
})
export class IndexDataFormComponent implements OnInit, OnDestroy {
  @Input() form: UntypedFormGroup;
  @Input() index: Index | null;

  priceFrequencyOptions = enumToOptions(PriceFrequency);
  publishingDelayUnitOptions = enumToOptions(PublishingDelayUnit);
  proxyTypeOptions = enumToOptions(ProxyType);
  indexUUIDs$ = this.store.indexUUIDs$;

  private unsubscribeAll: Subject<any> = new Subject();

  constructor(private store: StoreService, private fb: UntypedFormBuilder, private cdr: ChangeDetectorRef) {
  }

  get bundleFormula(): UntypedFormArray {
    return this.form.get('bundle_formula') as UntypedFormArray;
  }

  ngOnInit(): void {
    // Subscribe proxy type change and clear the related inputs
    this.form
      .get('proxy_type')
      ?.valueChanges.pipe(takeUntil(this.unsubscribeAll))
      .subscribe((value) => {
        !value ? this.form.get('proxy_notes')?.setValue(null) : null;
        !value ? this.form.get('proxy_factor')?.setValue(null) : null;
        !value ? this.form.get('proxy_index')?.setValue(null) : null;

        value === 'index' ? this.form.get('proxy_factor')?.setValue(null) : null;
        value === 'factor' ? this.form.get('proxy_index')?.setValue(null) : null;
        value === 'future' ? this.form.get('proxy_index')?.setValue(null) : null;
      });

    this.form
      .get('bundle_formula')
      ?.valueChanges.pipe(takeUntil(this.unsubscribeAll))
      .subscribe((formulas: BundleFormulaFormGroup[]) => {
        this.setDisplayFormula(formulas);
      });

    // To show display formula on initial load
    this.store.indexUUIDs$.pipe(takeUntil(this.unsubscribeAll)).subscribe((indexUUIDs: IndexUUID[]) => {
      this.setDisplayFormula(this.form.get('bundle_formula')?.value);
    });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }

  addBundle(): void {
    this.bundleFormula?.push(this.fb.group({ ...indexBundleFormulaFormGroup(null, null, false) }));
    // HOTFIX: Enforce detect changes when adding new field.Form.invalid was originally true, but after the adding
    //  it goes back to false. This change should be detected manually.
    this.cdr.detectChanges();
  }

  removeBundle(index: number): void {
    if (index > 0) {
      this.bundleFormula?.removeAt(index);
    }
  }

  setDisplayFormula(formulas: BundleFormulaFormGroup[]) {
    const { formulaExpression } = getBundleFormulaExpression(formulas, this.store.indexUUIDs);
    // NOTE: Example display string is - "3 * AE2 + 2 * AR1 + 53.236 * AE3"
    this.form.get('bundle_display_formula')?.setValue(formulaExpression);
  }
}
