import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BehaviorSubject, filter, firstValueFrom } from 'rxjs';

import { EmpiricalModellingResults } from '../../../../core/models/empirical-modelling.model';
import { IndexLibraryService } from '../../../../core/services/index-library.service';
import { ToastService } from '../../../../ui-kit/toast/toast.service';
import { EmpiricalModellingContract } from '../../../../core/strict-typed-forms/risk-analysis.form';
import { LoadingSpinner } from '../../../../ui-kit/spinner/spinner';
import { IndexDetailsStoreService } from '../../index-details-store.service';

@Component({
  selector: 'dd-empirical-modelling-tab',
  templateUrl: './empirical-modelling-tab.component.html',
  styleUrls: ['./empirical-modelling-tab.component.scss'],
})
export class EmpiricalModellingTabComponent implements OnInit, OnDestroy {
  @Input() fullscreen: boolean = false;

  empiricalModellingResults: EmpiricalModellingResults | null = null;
  primaryDataLoaded: boolean = false;
  spinner: LoadingSpinner<{ empiricalModellingResults: boolean }>;

  formChange$: BehaviorSubject<EmpiricalModellingContract[]> = new BehaviorSubject<EmpiricalModellingContract[]>([]);
  calculate$: BehaviorSubject<EmpiricalModellingResults | null> = new BehaviorSubject<EmpiricalModellingResults | null>(
    this.empiricalModellingResults
  );

  constructor(
    private fb: FormBuilder,
    private indexLibraryService: IndexLibraryService,
    public indexDetailsStoreService: IndexDetailsStoreService,
    private toast: ToastService
  ) {
  }

  async ngOnInit() {
    this.spinner = new LoadingSpinner({
      empiricalModellingResults: 'Loading empirical modelling results...',
    });
    this.spinner.loaders.empiricalModellingResults.hide();
    // Wait until all primary data loading is finished...
    await firstValueFrom(this.indexDetailsStoreService.spinner.isLoading$.pipe(filter((isLoading) => !isLoading)));
    this.primaryDataLoaded = true;
  }

  ngOnDestroy() {
    this.spinner.destroy();
  }

  async calculatePayoffs(contracts: EmpiricalModellingContract[]) {
    this.spinner.loaders.empiricalModellingResults.show();
    this.empiricalModellingResults = null;
    try {
      const { data: results } = await firstValueFrom(
        this.indexLibraryService.empiricalModelling(this.indexDetailsStoreService.indexId, contracts)
      );
      this.empiricalModellingResults = results;
      this.calculate$.next(this.empiricalModellingResults);
      setTimeout(() => {
        document.getElementById('empirical-modelling-results')!.scrollIntoView({
          behavior: 'smooth',
        });
      }, 300);
    } catch (e) {
      this.toast.error('Failed to load empirical modelling results.');
    } finally {
      this.spinner.loaders.empiricalModellingResults.hide();
    }
  }
}
