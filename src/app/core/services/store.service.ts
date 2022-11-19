import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { IndexProvider, IndexUUID } from '../models/index.model';
import {
  ClassHierarchy,
  GroupHierarchy,
  HierarchyType,
  KingdomHierarchy,
  ProductHierarchy,
} from '../models/hierarchy.model';
import { Unit } from '../models/unit.model';
import { Nation } from '../models/nation.model';
import { Currency } from '../models/currency.model';
import { IndexService } from './index.service';
import { CurrencyService } from './currency.service';
import { DiService } from './di.service';
import { NationService } from './nation.service';
import { UnitService } from './unit.service';
import { IndexProviderService } from './index-provider.service';
import { HierarchyService } from './hierarchy.service';
import { ToastService } from '../../ui-kit/toast/toast.service';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  indexUUIDs: IndexUUID[] = [];
  indexUUIDs$: BehaviorSubject<IndexUUID[]> = new BehaviorSubject(this.indexUUIDs);

  diSpiders: string[] = [];
  diSpiders$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(this.diSpiders);

  hierarchies: ProductHierarchy[] = [];
  hierarchies$: BehaviorSubject<ProductHierarchy[]> = new BehaviorSubject<ProductHierarchy[]>(this.hierarchies);

  classes: ClassHierarchy[] = [];
  classes$: BehaviorSubject<ClassHierarchy[]> = new BehaviorSubject<ClassHierarchy[]>(this.classes);

  groups: GroupHierarchy[] = [];
  groups$: BehaviorSubject<GroupHierarchy[]> = new BehaviorSubject<GroupHierarchy[]>(this.groups);

  kingdoms: KingdomHierarchy[] = [];
  kingdoms$: BehaviorSubject<KingdomHierarchy[]> = new BehaviorSubject<KingdomHierarchy[]>(this.kingdoms);

  units: Unit[] = [];
  units$: BehaviorSubject<Unit[]> = new BehaviorSubject<Unit[]>(this.units);

  nations: Nation[] = [];
  nations$: BehaviorSubject<Nation[]> = new BehaviorSubject<Nation[]>(this.nations);

  currencies: Currency[] = [];
  currencies$: BehaviorSubject<Currency[]> = new BehaviorSubject<Currency[]>(this.currencies);

  indexProviders: IndexProvider[] = [];
  indexProviders$: BehaviorSubject<IndexProvider[]> = new BehaviorSubject<IndexProvider[]>(this.indexProviders);

  constructor(
    private indexService: IndexService,
    private currencyService: CurrencyService,
    private nationService: NationService,
    private unitService: UnitService,
    private indexProviderService: IndexProviderService,
    private diService: DiService,
    private hierarchyService: HierarchyService,
    private toast: ToastService
  ) {}

  loadIndexUUIDs(): void {
    this.indexService.getIndexUUIDs().subscribe({
      next: (res) => {
        this.indexUUIDs = res;
        this.indexUUIDs$.next(this.indexUUIDs);
      },
      error: (err) => {
        if (err.status === 0) {
          this.toast.error('Failed to fetch index list.');
        }
      },
    });
  }

  loadDISpiders(): void {
    this.diService.getDISpiders().subscribe({
      next: (res) => {
        this.diSpiders = res;
        this.diSpiders$.next(this.diSpiders);
      },
      error: (err) => {
        if (err.status === 0) {
          this.toast.error('Failed to fetch DI spiders.');
        }
      },
    });
  }

  loadHierarchies(): void {
    this.hierarchyService.getHierarchies<ProductHierarchy>(undefined).subscribe({
      next: (res) => {
        this.hierarchies = res.results;
        this.hierarchies$.next(this.hierarchies);
      },
      error: (err) => {
        if (err.status === 0) {
          this.toast.error('Failed to fetch hierarchies.');
        }
      },
    });
  }

  loadClasses(): void {
    this.hierarchyService.getHierarchies<ClassHierarchy>(HierarchyType.Class).subscribe({
      next: (res) => {
        this.classes = res.results;
        this.classes$.next(this.classes);
      },
      error: (err) => {
        if (err.status === 0) {
          this.toast.error('Failed to fetch classes.');
        }
      },
    });
  }

  loadGroups(): void {
    this.hierarchyService.getHierarchies<GroupHierarchy>(HierarchyType.Group).subscribe({
      next: (res) => {
        this.groups = res.results;
        this.groups$.next(this.groups);
      },
      error: (err) => {
        if (err.status === 0) {
          this.toast.error('Failed to fetch groups.');
        }
      },
    });
  }

  loadKingdoms(): void {
    this.hierarchyService.getHierarchies<KingdomHierarchy>(HierarchyType.Kingdom).subscribe({
      next: (res) => {
        this.kingdoms = res.results;
        this.kingdoms$.next(this.kingdoms);
      },
      error: (err) => {
        if (err.status === 0) {
          this.toast.error('Failed to fetch kingdoms.');
        }
      },
    });
  }

  loadUnits(): void {
    this.unitService.getUnits().subscribe({
      next: (res) => {
        this.units = res;
        this.units$.next(this.units);
      },
      error: (err) => {
        if (err.status === 0) {
          this.toast.error('Failed to fetch units.');
        }
      },
    });
  }

  loadNations(): void {
    this.nationService.getNations().subscribe({
      next: (res) => {
        this.nations = res;
        this.nations$.next(this.nations);
      },
      error: (err) => {
        if (err.status === 0) {
          this.toast.error('Failed to fetch nations.');
        }
      },
    });
  }

  loadCurrencies(): void {
    this.currencyService.getCurrencies().subscribe({
      next: (res) => {
        this.currencies = res;
        this.currencies$.next(this.currencies);
      },
      error: (err) => {
        if (err.status === 0) {
          this.toast.error('Failed to fetch currencies.');
        }
      },
    });
  }

  loadIndexProviders(): void {
    this.indexProviderService.getIndexProviders().subscribe({
      next: (res) => {
        this.indexProviders = res;
        this.indexProviders$.next(this.indexProviders);
      },
      error: (err) => {
        if (err.status === 0) {
          this.toast.error('Failed to fetch index providers.');
        }
      },
    });
  }
}
