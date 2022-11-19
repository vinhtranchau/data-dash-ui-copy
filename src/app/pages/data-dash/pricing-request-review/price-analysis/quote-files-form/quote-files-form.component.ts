import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { RollingDealPortfolio } from '../../../../../core/models/trading-center.model';
import { ToastService } from '../../../../../ui-kit/toast/toast.service';
import { RollingDealService } from '../../../../../core/services/rolling-deal.service';

@Component({
  selector: 'dd-quote-files-form',
  templateUrl: './quote-files-form.component.html',
  styleUrls: ['./quote-files-form.component.scss'],
})
export class QuoteFilesFormComponent implements OnInit {
  @Input() deal: RollingDealPortfolio;

  @Output() uploadFinished: EventEmitter<any> = new EventEmitter();

  @ViewChild('fileUpload') fileUpload: TemplateRef<any>;

  isUploading = false;

  constructor(private readonly toast: ToastService, private readonly rollingDealService: RollingDealService) {}

  ngOnInit(): void {}

  async selectFile(e: any) {
    try {
      this.isUploading = true;

      for (let i = 0; i < e.target.files.length; i++) {
        const file: File = e.target.files[0];

        if (file.size > 5242880) {
          this.toast.error('File upload cannot be larger than 5MB.');
          return;
        }

        await firstValueFrom(this.rollingDealService.uploadQuote(this.deal.id, file));
      }
      this.toast.success('Upload successful.');

      // Load Deal data after file uploading
      this.uploadFinished.emit();
    } catch (e) {
      this.toast.error('Unable to upload, something went wrong.');
    } finally {
      this.isUploading = false;
    }
  }
}
