import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { IndexPrice } from '../../../../core/models/index.model';
import { ClientIndex, ContractType } from '../../../../core/models/trading-center.model';
import { dataDashRoute } from '../../../../core/routes/data-dash.route';
import { IndexLibraryService } from '../../../../core/services/index-library.service';
import { TradingCenterService } from '../../../../core/services/trading-center.service';

@Component({
  selector: 'dd-purchase-deal',
  templateUrl: './purchase-deal.component.html',
  styleUrls: ['./purchase-deal.component.scss'],
})
export class PurchaseDealComponent implements OnInit {
  indexId: string;
  indexPrices: IndexPrice[];
  indexDetails: ClientIndex;

  isLoading = true;
  hasError = false;

  indexContractType: ContractType;
  contractType = ContractType;
  dataDashRoute = dataDashRoute;

  constructor(
    private route: ActivatedRoute,
    private tradingCenterService: TradingCenterService,
    private indexLibraryService: IndexLibraryService,
    private location: Location
  ) {}

  async ngOnInit() {
    const { id, type } = this.route.snapshot.params;
    this.indexId = id;

    // Call API for activity logs
    this.postActivity().then();
    await this.getIndexDetails(this.indexId).then();
    await this.getIndexPrice(this.indexId).then();
    this.isLoading = false;

    if ([ContractType.Individual, ContractType.RollingDeal].includes(type)) {
      this.indexContractType = type;
    } else {
      this.indexContractType = ContractType.Individual;
      this.location.replaceState(
        `${dataDashRoute.root}/${dataDashRoute.tradingCenter}/trade/${id}/${ContractType.Individual}`
      );
    }

    // If selection is not allowed, change selection to other contract type
    if (this.indexContractType == ContractType.Individual && !this.indexDetails.in_hedging_book) {
      this.indexContractType = ContractType.RollingDeal;
      this.location.replaceState(
        `${dataDashRoute.root}/${dataDashRoute.tradingCenter}/trade/${id}/${ContractType.RollingDeal}`
      );
    } else if (this.indexContractType == ContractType.RollingDeal && !this.indexDetails.is_rolling_deal) {
      this.indexContractType = ContractType.Individual;
      this.location.replaceState(
        `${dataDashRoute.root}/${dataDashRoute.tradingCenter}/trade/${id}/${ContractType.Individual}`
      );
    }
  }

  private async postActivity() {
    try {
      await firstValueFrom(
        this.indexLibraryService.postIndexActivity({
          index_detail_id: this.indexId,
        })
      );
    } catch (error) {}
  }

  private async getIndexPrice(indexId: string) {
    try {
      this.indexPrices = await firstValueFrom(this.tradingCenterService.getIndexPrice(indexId));
    } catch (e) {
      this.hasError = true;
    } finally {
    }
  }

  private async getIndexDetails(indexId: string) {
    try {
      this.indexDetails = await firstValueFrom(this.tradingCenterService.getIndexDetails(indexId));
    } catch (e) {
      this.hasError = true;
    } finally {
    }
  }
}
