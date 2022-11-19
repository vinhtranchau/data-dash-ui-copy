import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

import { IndexDetailsDialogComponent } from '../index-details-dialog/index-details-dialog.component';
import { CommonService } from '../../../core/services/common.service';

@Component({
  selector: 'dd-index-details-dialog-wrapper',
  templateUrl: './index-details-dialog-wrapper.component.html',
  styleUrls: ['./index-details-dialog-wrapper.component.scss'],
})
export class IndexDetailsDialogWrapperComponent implements OnInit {
  constructor(private route: ActivatedRoute, private commonService: CommonService, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    const params = this.route.snapshot.params;

    const { id, tab, sizeType } = params;

    const fullscreen = sizeType == 'fullscreen';
    const size = fullscreen ? { width: '100vw', height: '100vh' } : { width: '2250px' };

    const dialogRef = this.dialog.open(IndexDetailsDialogComponent, {
      data: { id, tab, fullscreen },
      panelClass: fullscreen ? 'full-screen-dialog' : 'rootModal',
      ...size,
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
