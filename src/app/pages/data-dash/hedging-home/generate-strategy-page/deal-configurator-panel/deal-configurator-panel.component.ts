import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { debounceTime, firstValueFrom, Subject, takeUntil } from 'rxjs';

import { Position } from '../../../../../core/models/hedging.model';
import { Index } from '../../../../../core/models/index.model';
import { StoreService } from '../../../../../core/services/store.service';
import { IndexService } from '../../../../../core/services/index.service';
import { ToastService } from '../../../../../ui-kit/toast/toast.service';

import { IndexSelectTabComponent } from './index-select-tab/index-select-tab.component';
import { PositionSelectTabComponent } from './position-select-tab/position-select-tab.component';
import { DealDetailsConfiguratorComponent } from './deal-details-configurator/deal-details-configurator.component';

@Component({
  selector: 'dd-deal-configurator-panel',
  templateUrl: './deal-configurator-panel.component.html',
  styleUrls: ['./deal-configurator-panel.component.scss'],
})
export class DealConfiguratorPanelComponent implements OnInit, OnDestroy {
  @Output() changeDealConfig: EventEmitter<{ dealConfigForm: FormGroup; indexUUID: string }> = new EventEmitter<{
    dealConfigForm: FormGroup;
    indexUUID: string;
  }>();

  @ViewChild(IndexSelectTabComponent) indexSelectTab: IndexSelectTabComponent;
  @ViewChild(PositionSelectTabComponent) positionSelectTab: PositionSelectTabComponent;
  @ViewChild(DealDetailsConfiguratorComponent) dealDetailConfigurator: DealDetailsConfiguratorComponent;

  index: Index | null;
  isIndexDetailLoading = false;

  private indexUUID: string = '';
  private selectedPosition: Position | null = null;
  private dealConfigForm: FormGroup; // For saving deal configuration, will be prompted to the parent as a form group object

  private changeSelection$: Subject<any> = new Subject<any>();
  private unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private indexService: IndexService, private toast: ToastService, private store: StoreService) {}

  ngOnInit(): void {
    this.store.loadIndexUUIDs();
    // Add debounce time to catch value change events from two forms
    this.changeSelection$.pipe(debounceTime(100), takeUntil(this.unsubscribeAll)).subscribe(async () => {
      if (!this.indexUUID) {
        // Nothing selected from the list, position and index all are supposed to send index UUID
        this.index = null;
        this.dealDetailConfigurator.setFormValues(this.index, null);
        return;
      }

      // Deal is available when only user selected existing position
      const deal = this.selectedPosition ? this.selectedPosition.deal_config : null;

      // Load index details (index.lastPrice will be used to set validation of the deal configurator form)
      await this.loadIndexDetail();

      this.dealDetailConfigurator.setFormValues(this.index, deal);
    });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }

  onTabChange() {
    // When use change tab, we need to reset the form to deselect item.
    if (!this.indexSelectTab || !this.positionSelectTab) {
      return;
    }

    this.indexSelectTab.reset();
    this.positionSelectTab.reset();
  }

  async onChangePosition(position: Position | null) {
    this.selectedPosition = position;
    this.indexUUID = 'some-index-uuid'; // TODO: backend has to change position to include the index uuid
    this.changeSelection$.next(position);
  }

  async onChangeIndex(indexUUID: string) {
    this.indexUUID = indexUUID;
    this.changeSelection$.next(indexUUID);
  }

  onChangeDealConfigForm(dealConfigForm: FormGroup) {
    this.dealConfigForm = dealConfigForm;
    this.changeDealConfig.next({ dealConfigForm, indexUUID: this.indexUUID });
  }

  private async loadIndexDetail() {
    this.index = null;
    if (!this.indexUUID) {
      return;
    }
    try {
      this.isIndexDetailLoading = true;
      this.index = await firstValueFrom(this.indexService.getIndex(this.indexUUID));
    } catch (e) {
      this.toast.error('Failed to load index details.');
    } finally {
      this.isIndexDetailLoading = false;
    }
  }
}
