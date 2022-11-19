import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ClientIndex } from '../../core/models/trading-center.model';
import { IndexLibraryService } from '../../core/services/index-library.service';
import { ToastService } from '../../ui-kit/toast/toast.service';

@Component({
  selector: 'dd-index-details-header',
  templateUrl: './index-details-header.component.html',
  styleUrls: ['./index-details-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexDetailsHeaderComponent {
  @Input() indexDetails: ClientIndex;

  constructor(private indexLibraryService: IndexLibraryService, private toastService: ToastService) {}

  async updateFavorite() {
    this.indexDetails.is_favorite = !this.indexDetails.is_favorite;
    await firstValueFrom(this.indexLibraryService.postFavorite(this.indexDetails.id));
    this.toastService.success(
      (this.indexDetails.is_favorite ? 'Added ' : 'Removed ') +
        this.indexDetails.stable_index_code +
        (this.indexDetails.is_favorite ? ' to ' : ' from ') +
        'favorite indexes'
    );
  }
}
