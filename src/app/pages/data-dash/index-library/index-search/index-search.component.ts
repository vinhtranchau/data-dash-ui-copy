import { AfterViewInit, Component, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CdkVirtualScrollViewport, ScrollDispatcher } from '@angular/cdk/scrolling';
import { filter, firstValueFrom, Subscription } from 'rxjs';
import { ToastService } from '../../../../ui-kit/toast/toast.service';
import { IndexLibraryService } from '../../../../core/services/index-library.service';
import { AdvancedIndexFilterDialogService } from '../../../../shared/advanced-index-filter-dialog/advanced-index-filter-dialog.service';
import { SearchEmit } from '../../../../shared/advanced-index-filter-dialog/advanced-index-filter-dialog.form';
import { ToastPriority } from '../../../../ui-kit/toast/toast.model';
import { IndexSearchService } from './index-search.service';
import { IndexService } from '../../../../core/services/index.service';

@Component({
  selector: 'dd-index-search',
  templateUrl: './index-search.component.html',
  styleUrls: ['./index-search.component.scss'],
})
export class DDIndexSearchComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(CdkVirtualScrollViewport) scrollRef: CdkVirtualScrollViewport;
  itemSize = 350;
  isLoading: boolean = false;
  searchTerm: string = '';
  pageSize: number = 3;
  pageIndex: number = 0;
  total: number = 0;
  endOfResults: boolean = false;

  private _scrollSubscription = Subscription.EMPTY;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private indexService: IndexService,
    private indexLibraryService: IndexLibraryService,
    private toast: ToastService,
    private scrollDispatcher: ScrollDispatcher,
    private advancedIndexFilterService: AdvancedIndexFilterDialogService,
    private zone: NgZone,
    public indexSearchService: IndexSearchService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.searchTerm = params['search_term'];
      if (params['index_filter']) {
        this.advancedIndexFilterService.indexFilter = JSON.parse(params['index_filter']);
      }
      this.pageIndex = 0;
      this.indexSearchService.indexes = [];
      this.total = 0;
      this.endOfResults = false;
      this.loadInitialResults();
    });
    if (window.innerWidth < 768) this.itemSize = 600;
  }

  async loadInitialResults() {
    const loadNumPages = Math.ceil((Math.ceil(window.innerHeight / this.itemSize) + 1) / this.pageSize); // load enough to fill page height
    for (let i = 0; i < loadNumPages; i++) {
      await this.loadMoreResults();
    }
  }

  ngAfterViewInit() {
    this.scrollDispatcher
      .scrolled()
      .pipe(
        filter((event) => {
          return (
            this.scrollRef.getRenderedRange().end === this.indexSearchService.indexes.length &&
            !this.isLoading &&
            !this.endOfResults
          );
        })
      )
      .subscribe((event) => {
        this.zone.run(() => {
          this.loadMoreResults();
        });
      });
  }

  search(searchEmit: SearchEmit): void {
    const { searchTerm, indexFilter } = searchEmit;
    this.router
      .navigate(['.'], {
        queryParams: { search_term: searchTerm, index_filter: JSON.stringify(indexFilter) },
        relativeTo: this.activatedRoute,
      })
      .then();
  }

  async loadMoreResults() {
    if (!this.endOfResults) {
      try {
        this.isLoading = true;
        const {
          data: { results, total },
        } = await firstValueFrom(
          this.indexService.indexSearch(
            this.pageSize,
            this.pageIndex + 1,
            this.searchTerm || '',
            this.advancedIndexFilterService.indexFilter
          )
        );
        this.indexSearchService.indexes = [...this.indexSearchService.indexes, ...results];
        this.total = total;
        this.pageIndex += 1;
        this.endOfResults = Math.ceil(this.total / this.pageSize) <= this.pageIndex;
        if (this.pageIndex === 1) {
          this.toast.success(`Found ${this.total} related indexes`, ToastPriority.Medium);
        }
      } catch (e) {
        this.toast.error('Failed to load index summaries.');
      } finally {
        this.isLoading = false;
      }
    }
  }

  ngOnDestroy(): void {
    this._scrollSubscription.unsubscribe();
  }
}
