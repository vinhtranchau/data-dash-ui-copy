import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';

import { Position } from '../../../../../../core/models/hedging.model';
import { HedgingService } from '../../../../../../core/services/hedging.service';
import { ToastService } from '../../../../../../ui-kit/toast/toast.service';

@Component({
  selector: 'dd-position-select-tab',
  templateUrl: './position-select-tab.component.html',
  styleUrls: ['./position-select-tab.component.scss'],
})
export class PositionSelectTabComponent implements OnInit, OnDestroy {
  @Output() changePosition: EventEmitter<Position | null> = new EventEmitter<Position | null>();

  positions: Position[] = [];
  isLoading = false;

  position: Position | null;

  form: FormGroup = this.fb.group({
    position: ['', Validators.required],
  });

  private unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private fb: FormBuilder, private hedgingService: HedgingService, private toast: ToastService) {}

  ngOnInit(): void {
    this.loadPositions();
    this.form
      .get('position')
      ?.valueChanges.pipe(takeUntil(this.unsubscribeAll))
      .subscribe((value) => {
        // const found = this.positions.find((x) => x.futures_code === value);
        // this.position = found || null;
        // this.changePosition.next(this.position);
      });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }

  reset() {
    this.form.reset();
  }

  private async loadPositions() {
    try {
      this.isLoading = true;
      const positions = await firstValueFrom(this.hedgingService.getPositionList());
      this.positions = positions.map((position) => ({
        ...position,
      }));
    } catch (e) {
      this.toast.error('Failed to load hedging positions.');
    } finally {
      this.isLoading = false;
    }
  }
}
