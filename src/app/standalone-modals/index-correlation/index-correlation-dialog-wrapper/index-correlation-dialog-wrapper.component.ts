import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { IndexCorrelationDialogComponent } from '../index-correlation-dialog/index-correlation-dialog.component';

@Component({
  selector: 'dd-index-correlation-dialog-wrapper',
  templateUrl: './index-correlation-dialog-wrapper.component.html',
  styleUrls: ['./index-correlation-dialog-wrapper.component.scss'],
})
export class IndexCorrelationDialogWrapperComponent implements OnInit {
  constructor(private route: ActivatedRoute, private dialog: MatDialog, private commonService: CommonService) {
  }

  ngOnInit(): void {
    const params = this.route.snapshot.params;

    const { indexId1, indexId2, sizeType } = params;
    let fullscreen: any;
    if (sizeType == 'fullscreen') {
      fullscreen = true;
    } else {
      fullscreen = false;
    }

    let size;
    if (fullscreen) {
      size = { width: '100vw', height: '100vh' };
    } else {
      size = { width: '2250px' };
    }

    const dialogRef = this.dialog.open(IndexCorrelationDialogComponent, {
      data: { indexId1, indexId2, fullscreen },
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
