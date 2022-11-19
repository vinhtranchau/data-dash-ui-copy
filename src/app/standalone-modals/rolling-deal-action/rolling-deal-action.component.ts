import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

import { CommonService } from '../../core/services/common.service';
import { RollingDealDialogComponent } from './rolling-deal-dialog/rolling-deal-dialog.component';

@Component({
  selector: 'dd-rolling-deal-action',
  templateUrl: './rolling-deal-action.component.html',
  styleUrls: ['./rolling-deal-action.component.scss'],
})
export class RollingDealActionComponent implements OnInit {
  constructor(private route: ActivatedRoute, private commonService: CommonService, private dialog: MatDialog) {}

  ngOnInit(): void {
    const params = this.route.snapshot.params;

    const { id } = params;

    const dialogRef = this.dialog.open(RollingDealDialogComponent, {
      data: { id },
      panelClass: 'rootModal',
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe(() => this.commonService.closeStandaloneModal());

    dialogRef.backdropClick().subscribe(() => {
      // Allow backdrop click to close but not esc
      dialogRef.close();
    });
  }
}
