import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, filter, firstValueFrom } from 'rxjs';

import {
  AdditionalOptions,
  AdditionalOptionsForm,
  additionalOptionsFormGroup,
} from '../../../../../core/strict-typed-forms/index-details-additional-options.form';
import { IndexDetailsStoreService } from '../../../index-details-store.service';
import { SeasonalityVerdict } from '../../../../../core/models/index.model';
import { StoreService } from '../../../../../core/services/store.service';

@Component({
  selector: 'dd-additional-options-form',
  templateUrl: './additional-options-form.component.html',
  styleUrls: ['./additional-options-form.component.scss'],
})
export class AdditionalOptionsFormComponent implements OnInit {
  @Output() filterChanged: EventEmitter<AdditionalOptions> = new EventEmitter<AdditionalOptions>();
  @Input() hasExtension: boolean = false;

  @Output() download: EventEmitter<any> = new EventEmitter<any>();

  SeasonalityVerdict = SeasonalityVerdict;

  form: FormGroup<AdditionalOptionsForm> = this.fb.nonNullable.group({ ...additionalOptionsFormGroup });
  indexDetails$ = this.indexDetailsStoreService.indexDetails$;
  indexUUIDs$ = this.store.indexUUIDs$;

  constructor(
    private fb: FormBuilder,
    private indexDetailsStoreService: IndexDetailsStoreService,
    private store: StoreService
  ) {
  }

  async ngOnInit() {
    this.form.disable();
    await firstValueFrom(this.indexDetailsStoreService.spinner.isLoading$.pipe(filter((isLoading) => !isLoading)));
    this.form.enable();

    this.form.valueChanges.pipe(debounceTime(600)).subscribe((form) => {
      this.filterChanged.emit(form);
    });
  }
}
