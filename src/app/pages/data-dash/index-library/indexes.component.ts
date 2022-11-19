import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AdvancedIndexFilterDialogService
} from '../../../shared/advanced-index-filter-dialog/advanced-index-filter-dialog.service';
import { SearchEmit } from '../../../shared/advanced-index-filter-dialog/advanced-index-filter-dialog.form';

@Component({
  selector: 'dd-indexes',
  templateUrl: './indexes.component.html',
  styleUrls: ['./indexes.component.scss'],
})
export class DDIndexesComponent implements OnInit {

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private advancedIndexFilterService: AdvancedIndexFilterDialogService,
  ) {
  }

  search(searchEmit: SearchEmit): void {
    const { searchTerm, indexFilter } = searchEmit;
    this.router
      .navigate(['./search'], {
        queryParams: { search_term: searchTerm, index_filter: JSON.stringify(indexFilter) },
        relativeTo: this.activatedRoute,
      })
      .then();
  }

  ngOnInit(): void {
    this.advancedIndexFilterService.resetFilterDialog();
  }
}
