import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { SelectionChange, SelectionModel } from '@angular/cdk/collections';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Subject, takeUntil } from 'rxjs';

import { FormatCondition, TableAction, TableActionType, TableColumn } from '../table.model';

@Component({
  selector: 'dd-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class DataTableComponent<T> implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {
  @Input() columns: TableColumn[] = [];
  @Input() displayedColumns: string[] = [];
  @Input() stickyColumns: string[] = [];
  @Input() formatConditions: FormatCondition[] = [];
  @Input() isLoading: boolean = true;
  @Input() hasSort: boolean = false;
  @Input() hasEditPermission: boolean = false;
  @Input() dataSource = new MatTableDataSource<T>([]);
  @Input() expandTemplate: TemplateRef<any>;
  @Input() selectable = false;
  @Input() multiSelect = false;
  @Input() expandable = false;
  @Input() isDetailContent = false;

  @Output() action: EventEmitter<TableAction> = new EventEmitter<TableAction>();
  @Output() sort: EventEmitter<Sort> = new EventEmitter<Sort>();
  @Output() changeSelection: EventEmitter<SelectionChange<T>> = new EventEmitter<SelectionChange<T>>();

  @ViewChild(MatTable) table: MatTable<any>;

  TableActionType = TableActionType;
  selection: SelectionModel<T>;
  expandedElement: any;

  private unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    if (this.selectable) {
      this.selection = new SelectionModel<T>(this.multiSelect, []);
      this.selection.changed
        .asObservable()
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe((value) => {
          this.changeSelection.emit(value);
        });
    }
  }

  ngAfterViewInit(): void {
    // TODO: Find out better solution for predefined fields
    if (this.selectable) {
      this.displayedColumns = ['select', ...this.displayedColumns];
    }
    if (this.expandable) {
      this.displayedColumns = ['expand', ...this.displayedColumns];
    }
    this.cdr.detectChanges();
  }

  ngAfterViewChecked() {
    if (this.table) {
      this.table.updateStickyColumnStyles();
    }
  }

  ngOnDestroy() {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }
}
