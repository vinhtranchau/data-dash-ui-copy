import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { filter, firstValueFrom } from 'rxjs';

import { HierarchyService } from '../../../../core/services/hierarchy.service';
import { PermissionType } from '../../../../core/models/permission.model';
import { LoadDataEvent, TableAction, TableActionType, TableColumn } from '../../../../ui-kit/table/table.model';
import { HierarchyTableData, HierarchyType } from '../../../../core/models/hierarchy.model';
import { HierarchyDialogComponent } from '../hierarchy-edit-dialog/hierarchy-edit-dialog.component';
import { getHierarchyTableColumns, parseHierarchies } from '../../../../core/utils/hierarchy.util';
import { ToastService } from '../../../../ui-kit/toast/toast.service';

@Component({
  selector: 'dd-hierarchy-table',
  templateUrl: './hierarchy-tables.component.html',
  styleUrls: ['./hierarchy-tables.component.scss'],
})
export class HierarchyTableComponent implements OnInit {
  @Input() hierarchyType?: HierarchyType; // Table which will render all types

  PermissionType = PermissionType;
  dataSource = new MatTableDataSource<HierarchyTableData>([]);
  columns: TableColumn[];
  displayedColumns: string[];
  parent?: HierarchyType;

  total = 0;
  isLoading = true;
  lastLoadEvent: LoadDataEvent;

  constructor(private hierarchyService: HierarchyService, private dialog: MatDialog, private toast: ToastService) {}

  ngOnInit(): void {
    const { columns, parent } = getHierarchyTableColumns(this.hierarchyType);
    this.columns = columns;
    this.parent = parent;
    this.displayedColumns = this.columns.map((x) => x.name);
  }

  async loadData(e: LoadDataEvent) {
    try {
      this.isLoading = true;
      const { pageSize, pageIndex, keyword } = e;
      this.lastLoadEvent = e;
      const { results, count } = await firstValueFrom(
        this.hierarchyService.getHierarchies(this.hierarchyType, pageSize, pageIndex + 1, keyword || '')
      );
      this.total = count;
      this.dataSource.data = parseHierarchies(results, this.hierarchyType);
    } catch (e) {
      this.toast.error('Failed to load hierarchies');
    } finally {
      this.isLoading = false;
    }
  }

  action(obj: TableAction) {
    if (obj.action === TableActionType.Edit) {
      this.openHierarchyDialog(this.dataSource.data.find((x) => x.id === obj.id));
    }
  }

  add() {
    this.openHierarchyDialog();
  }

  private openHierarchyDialog(hierarchyData?: any) {
    return this.dialog
      .open(HierarchyDialogComponent, {
        width: '400px',
        data: { hierarchyType: this.hierarchyType, hierarchyData: hierarchyData, parent: this.parent },
        panelClass: 'rootModal',
      })
      .afterClosed()
      .pipe(filter((res) => res))
      .subscribe(() => this.loadData(this.lastLoadEvent));
  }
}
