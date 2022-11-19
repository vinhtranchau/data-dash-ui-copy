import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import {
  AdvancedIndexFilterDialogService
} from '../../../../shared/advanced-index-filter-dialog/advanced-index-filter-dialog.service';
import { SearchEmit } from '../../../../shared/advanced-index-filter-dialog/advanced-index-filter-dialog.form';

@Component({
  selector: 'dd-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class DDSearchBarComponent implements OnInit {
  @Output() search: EventEmitter<SearchEmit> = new EventEmitter<SearchEmit>();
  @Input() searchTerm: string = '';
  @Input() label: string = '';
  @Input() placeholder: string = '';

  constructor(public advancedIndexFilterService: AdvancedIndexFilterDialogService) {
  }

  ngOnInit(): void {
  }

  openFilterDialog() {
    this.advancedIndexFilterService.openIndexFilterDialog().subscribe(() => {
      this.search.emit({ searchTerm: this.searchTerm, indexFilter: this.advancedIndexFilterService.indexFilter });
    });
  }
}
