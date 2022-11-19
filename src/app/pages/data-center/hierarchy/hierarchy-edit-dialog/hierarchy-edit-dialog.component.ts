import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';

import { HierarchyDialogData } from './hierarchy-dialog.config';
import { ToastService } from '../../../../ui-kit/toast/toast.service';
import { HierarchyService } from '../../../../core/services/hierarchy.service';
import { HierarchyType } from '../../../../core/models/hierarchy.model';

@Component({
  selector: 'dd-hierarchy-dialog',
  templateUrl: './hierarchy-edit-dialog.component.html',
  styleUrls: ['./hierarchy-edit-dialog.component.scss'],
})
export class HierarchyDialogComponent<T> implements OnInit {
  HierarchyType = HierarchyType;
  dialogDisabled = false;
  parentOptions: T[] = [];
  parentField: string | null;

  form: UntypedFormGroup = this.fb.group({
    hierarchy: [this.data.hierarchyType],
    id: [this.data.hierarchyData?.id],
    name: [this.data.hierarchyData?.name, [Validators.required]],
    parent: [
      this.data.hierarchyType === 'kingdom' ? 'placeholder' : this.data.hierarchyData?.parent_id,
      [Validators.required],
    ],
  });

  constructor(
    private fb: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: HierarchyDialogData,
    private toast: ToastService,
    private dialogRef: MatDialogRef<HierarchyDialogComponent<T>>,
    private hierarchyService: HierarchyService
  ) {}

  ngOnInit(): void {
    this.hierarchyService.getHierarchies<T>(this.data.parent || HierarchyType.Kingdom).subscribe({
      next: (res) => {
        this.parentOptions = res.results;
      },
    });
    this.parentField = this.getParentField(this.data.hierarchyType)
  }

  async save() {
    try {
      const payload: any = {
        name: this.form.get('name')?.value,
        hierarchy: this.data.hierarchyType,
      };
      if (this.parentField) {
        payload[this.parentField] = this.form.get('parent')?.value
      }
      this.form.disable();
      this.dialogDisabled = true;
      if (this.form.get('id')?.value) {
        payload.id = this.form.get('id')?.value;
        await firstValueFrom(this.hierarchyService.updateHierarchy(payload));
      } else {
        await firstValueFrom(this.hierarchyService.createHierarchy(payload));
      }
      this.toast.success('Hierarchy updated successfully.');
      this.dialogRef.close(true);
    } catch (e: any) {
      console.log(e);
      this.toast.apiErrorResponse(e);
    } finally {
      this.form.enable();
      this.dialogDisabled = false;
    }
  }

  getParentField(hierarchy: HierarchyType) {
    switch (hierarchy) {
      case HierarchyType.Product:
        return `${HierarchyType.Class}_hierarchy`
      case HierarchyType.Class:
        return `${HierarchyType.Group}_hierarchy`
      case HierarchyType.Group:
        return `${HierarchyType.Kingdom}_hierarchy`
      default:
        return null
    }
  }
}
