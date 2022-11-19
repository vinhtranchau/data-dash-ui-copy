import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'dd-data-table-header',
  templateUrl: './data-table-header.component.html',
  styleUrls: ['./data-table-header.component.scss'],
})
export class DataTableHeaderComponent implements OnInit {
  @Output() search: EventEmitter<string> = new EventEmitter<string>();
  @Output() add: EventEmitter<any> = new EventEmitter<any>();

  @Input() addText: string = 'Add';
  @Input() hasAddButton: boolean = true;
  @Input() hasSearchFilter: boolean = true;
  @Input() hasEditPermission: boolean = false;
  @Input() isLoading: boolean = true;

  form: UntypedFormGroup = this.fb.group({
    search: '',
  });

  constructor(private fb: UntypedFormBuilder) {}

  ngOnInit(): void {
    if (this.hasSearchFilter) {
      this.form
        .get('search')
        ?.valueChanges.pipe(debounceTime(600))
        .subscribe((value) => {
          this.search.emit(value);
        });
    }
  }
}
