import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { StoreService } from '../../../../../../core/services/store.service';

@Component({
  selector: 'dd-index-select-tab',
  templateUrl: './index-select-tab.component.html',
  styleUrls: ['./index-select-tab.component.scss'],
})
export class IndexSelectTabComponent implements OnInit, OnDestroy {
  @Output() changeIndex: EventEmitter<string> = new EventEmitter<string>();

  indexUUIDs$ = this.store.indexUUIDs$;

  form: FormGroup = this.fb.group({
    uuid: [],
  });

  private unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private fb: FormBuilder, private store: StoreService) {}

  ngOnInit(): void {
    this.form
      .get('uuid')
      ?.valueChanges.pipe(takeUntil(this.unsubscribeAll))
      .subscribe((id) => {
        this.changeIndex.next(id);
      });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }

  reset() {
    this.form.reset();
  }
}
