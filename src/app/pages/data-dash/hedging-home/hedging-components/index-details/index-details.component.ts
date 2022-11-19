import { Component, Input } from '@angular/core';

import { Index } from '../../../../../core/models/index.model';
import { standaloneModalRoute } from '../../../../../core/routes/standalone-modal.route';
import { CommonService } from '../../../../../core/services/common.service';
import { relativePath } from '../../../../../core/utils/route.util';

@Component({
  selector: 'dd-index-details',
  templateUrl: './index-details.component.html',
  styleUrls: ['./index-details.component.scss'],
})
export class IndexDetailsComponent {
  @Input() index: Index | null;
  @Input() isLoading = false;

  standaloneModalRoute = standaloneModalRoute;

  constructor(private commonService: CommonService) {}

  openIndexModal(): void {
    if (this.index) {
      this.commonService.openStandaloneModal(
        relativePath([standaloneModalRoute.root, standaloneModalRoute.indexDetails, this.index.id, String(0)])
      );
    }
  }
}
