import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Sort } from '@angular/material/sort';
import { SelectionChange } from '@angular/cdk/collections';

import { FormatCondition, LoadDataEvent, TableAction, TableColumn } from '../table.model';
import { PermissionLevel, PermissionType } from '../../../core/models/permission.model';
import { RoleService } from '../../../core/services/role.service';

@Component({
  selector: 'dd-data-table-page',
  templateUrl: './data-table-page.component.html',
  styleUrls: ['./data-table-page.component.scss'],
})
export class DataTablePageComponent<T> implements OnInit {
  @Input() columns: TableColumn[] = [];
  @Input() displayedColumns: string[] = [];
  @Input() stickyColumns: string[] = [];
  @Input() formatConditions: FormatCondition[] = [];
  @Input() dataSource: MatTableDataSource<T> = new MatTableDataSource<T>();
  @Input() expandTemplate: TemplateRef<any>;
  @Input() total = 0;
  @Input() isLoading = true;
  @Input() hasHeader = false;
  @Input() headerAddText: string = 'Add';
  @Input() headerHasAddButton: boolean = true;
  @Input() headerHasSearchFilter: boolean = true;
  @Input() tableType: PermissionType;
  @Input() serverSideSearch: boolean = false;
  @Input() tableHeight: string = '';
  @Input() hasTabs: boolean = false;
  @Input() stickyPaginator: boolean = true;
  @Input() hasSort: boolean = false;
  @Input() pageSize: number = 15;
  @Input() selectable = false;
  @Input() multiSelect = false;
  @Input() expandable = false;

  @Output() loadData: EventEmitter<LoadDataEvent> = new EventEmitter<LoadDataEvent>();
  @Output() add: EventEmitter<any> = new EventEmitter<any>();
  @Output() action: EventEmitter<TableAction> = new EventEmitter<TableAction>();
  @Output() sort: EventEmitter<Sort> = new EventEmitter<Sort>();
  @Output() changeSelection: EventEmitter<SelectionChange<T>> = new EventEmitter<SelectionChange<T>>();

  hasEditPermission: boolean = false;

  keyword = '';
  pageIndex = 0;

  constructor(private roleService: RoleService) {}

  ngOnInit(): void {
    const permissionLevel = this.roleService.getPermissionLevel(this.tableType);
    this.hasEditPermission = permissionLevel >= PermissionLevel.Edit || permissionLevel === true;
    this.loadData.next({ pageSize: this.pageSize, pageIndex: this.pageIndex, keyword: this.keyword });
  }

  changePage(e: PageEvent): void {
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData.next({ pageSize: this.pageSize, pageIndex: this.pageIndex, keyword: this.keyword });
  }

  search(keyword: string): void {
    if (this.serverSideSearch) {
      this.pageIndex = 0;
      this.keyword = keyword;
      this.loadData.next({ pageSize: this.pageSize, pageIndex: this.pageIndex, keyword: this.keyword });
    } else {
      this.dataSource.filter = keyword.trim().toLowerCase();
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
  }
}
