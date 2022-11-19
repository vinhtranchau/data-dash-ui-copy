import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { RoleService } from '../../core/services/role.service';
import { NavItem } from '../../core/models/nav-items.model';
import { PermissionLevel, PermissionType, Platform } from '../../core/models/permission.model';
import { dataCenterRoute } from '../../core/routes/data-center.route';
import { dataDashRoute } from '../../core/routes/data-dash.route';

@Injectable({
  providedIn: 'root',
})
export class SidebarStatusService {
  isOpen: boolean = false;
  isOpen$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.isOpen);

  title: string;
  platform: Platform = Platform.DataDash;

  constructor(private roleService: RoleService) {}

  getNavItems(): NavItem[] {
    if (this.platform === Platform.DataCenter) {
      this.title = 'Data Center';
      return [
        {
          icon: 'book',
          title: 'Indexes',
          description:
            'Everything one needs to manage indexes in Stable. From onboarding new indexes, editing existing ones, <del>to deleting them all,</del> do not miss out.',
          route: `/${dataCenterRoute.root}/${dataCenterRoute.indexes}`,
          disabled: this.roleService.getPermissionLevel(PermissionType.IndexDetailsTable) < PermissionLevel.View,
        },
        {
          icon: 'file_copy',
          title: 'Scrape Management',
          description:
            "The center of Data Center's data! Match scrapes to indexes to update their prices or upload manual scrapes to Data Intelligence's database.",
          route: `/${dataCenterRoute.root}/${dataCenterRoute.scrapeMatching}`,
          disabled: this.roleService.getPermissionLevel(PermissionType.ScrapeMatchingTable) < PermissionLevel.View,
        },
        {
          icon: 'extension',
          title: 'Extensions',
          description:
            'Index price history too short? No problem! Just extend the price through a super simple linear regression and upload the results to extend existing prices.',
          route: `/${dataCenterRoute.root}/${dataCenterRoute.indexExtension}`,
          disabled: this.roleService.getPermissionLevel(PermissionType.IndexExtensionDataTable) < PermissionLevel.View,
        },
        {
          icon: 'history',
          title: 'Historical Data',
          description:
            'The fallback mechanism for adding extra prices when scrape matchings or extensions seems too complicated, historical data is a one-time price upload for an index.',
          route: `/${dataCenterRoute.root}/${dataCenterRoute.historicalData}`,
          disabled: this.roleService.getPermissionLevel(PermissionType.HistoricalDataTable) < PermissionLevel.View,
        },
        {
          icon: 'terrain',
          title: 'Hierarchies',
          description:
            'Index hierarchies fall under the order of Kingdom &rarr; Group &rarr; Class &rarr; Product and can be added or changed here at the scorn of others.',
          route: `/${dataCenterRoute.root}/${dataCenterRoute.hierarchy}`,
          disabled: this.roleService.getPermissionLevel(PermissionType.HierarchyTable) < PermissionLevel.View,
        },
        {
          icon: 'category',
          title: 'Units',
          description:
            'Units of measurement that index prices are quoted in. Would be a shorter list if the world could agree on a unified system.',
          route: `/${dataCenterRoute.root}/${dataCenterRoute.unit}`,
          disabled: this.roleService.getPermissionLevel(PermissionType.UnitTable) < PermissionLevel.View,
        },
        {
          icon: 'attach_money',
          title: 'Currencies',
          description:
            'Currencies that index prices are quoted in. Have ran out of additional comments so please do not read this.',
          route: `/${dataCenterRoute.root}/${dataCenterRoute.currency}`,
          disabled: this.roleService.getPermissionLevel(PermissionType.CurrencyTable) < PermissionLevel.View,
        },
        {
          icon: 'flag',
          title: 'Nations',
          description: 'Nations that an index can originate from. Hopefully the list does not decrease after the war.',
          route: `/${dataCenterRoute.root}/${dataCenterRoute.nation}`,
          disabled: this.roleService.getPermissionLevel(PermissionType.NationTable) < PermissionLevel.View,
        },
        {
          icon: 'business',
          title: 'Index Providers',
          description: "The source of the indexes, love them or hate them, we've got to scrape them.",
          route: `/${dataCenterRoute.root}/${dataCenterRoute.indexProvider}`,
          disabled: this.roleService.getPermissionLevel(PermissionType.IndexProviderTable) < PermissionLevel.View,
        },
        {
          icon: 'person',
          title: 'Users',
          description:
            'Users signed up on the platform, grant them access here to allow them in. More filler text here since only admins would be able to read this.',
          route: `/${dataCenterRoute.root}/${dataCenterRoute.users}`,
          disabled: this.roleService.getPermissionLevel(PermissionType.UsersTable) < PermissionLevel.View,
        },
        {
          icon: 'block',
          title: 'Permissions Groups',
          description:
            'Permission groups determine the access that users in each group are granted permission to, best to not be meddled with.',
          route: `/${dataCenterRoute.root}/${dataCenterRoute.permissions}`,
          disabled: this.roleService.getPermissionLevel(PermissionType.GroupPermissionTable) < PermissionLevel.View,
        },
        {
          icon: 'vpn_key',
          title: 'API Keys',
          description:
            'Create API Keys here for other teams to access our very secure data. Individual permissions can be set for each key to better safeguard sensitive information.',
          route: `/${dataCenterRoute.root}/${dataCenterRoute.apiKey}`,
          disabled: this.roleService.getPermissionLevel(PermissionType.CanGenerateApiKey) < PermissionLevel.View,
        },
      ];
    }
    this.title = 'Data Dash';
    return [
      {
        icon: 'home',
        title: 'Home',
        description:
          'The landing page of Data Dash, where you will find the latest updates and features to the platform.',
        route: `/${dataDashRoute.root}/${dataDashRoute.home}`,
        disabled: false,
      },
      {
        icon: 'book',
        title: 'Index Library',
        description: `For all your index needs! The library hosts a wide selection of indexes from pork to avocados and
          all tools necessary for modelling and analysis.`,
        route: `/${dataDashRoute.root}/${dataDashRoute.indexes}`,
        disabled: this.roleService.getPermissionLevel(PermissionType.IndexLibrary) < PermissionLevel.View,
      },
      {
        icon: 'crisis_alert',
        title: 'Index Alerts',
        description:
          'Stay up to date on all index matters. This page will display all and any abnormal events regarding your favourite indexes.',
        route: `/${dataDashRoute.root}/${dataDashRoute.indexAlerts}`,
        disabled: this.roleService.getPermissionLevel(PermissionType.IndexAlerts) < PermissionLevel.View,
      },
      {
        icon: 'shopping_cart',
        title: 'Trading Center',
        description:
          'For clients use only! The trading center allows verified clients to automatically quote and purchase option contracts on our indexes.',
        route: `/${dataDashRoute.root}/${dataDashRoute.tradingCenter}`,
        disabled: this.roleService.getPermissionLevel(PermissionType.TradingCenter) < PermissionLevel.View,
      },
      {
        icon: 'folder_special',
        title: 'Portfolio Summary',
        description:
          "Stable's portfolio summary of traded derivatives is shown here, view details such as our account balance or profit and loss.",
        route: `/${dataDashRoute.root}/${dataDashRoute.portfolioSummary}`,
        disabled: this.roleService.getPermissionLevel(PermissionType.PortfolioSummary) < PermissionLevel.View,
      },
      {
        icon: 'account_balance',
        title: 'Derivatives Trading',
        description: 'Best not to mess around with this page, the quants do all their highly advanced tradings here.',
        route: `/${dataDashRoute.root}/${dataDashRoute.derivativesTrading}`,
        disabled: this.roleService.getPermissionLevel(PermissionType.DerivativesTrading) < PermissionLevel.View,
      },
      {
        icon: 'forest',
        title: 'Hedging Home',
        description: "Don't know how to trade? Just generate a trading strategy here and trade away like a pro.",
        route: `/${dataDashRoute.root}/${dataDashRoute.hedgingHome}`,
        disabled: this.roleService.getPermissionLevel(PermissionType.HedgingHome) < PermissionLevel.View,
      },
      {
        icon: 'token',
        title: 'DS Price Review',
        description:
          'The section will contain a list of all the price requests that have been raised due to “Request for Quote” Actions by the customer.',
        route: `/${dataDashRoute.root}/${dataDashRoute.dsPricingRequestReview}`,
        disabled: this.roleService.getPermissionLevel(PermissionType.DataCenterAccess) < PermissionLevel.View,
      },
      {
        icon: 'token',
        title: 'UW Price Review',
        description: 'Underwriter price review along with price analysis functionality.',
        route: `/${dataDashRoute.root}/${dataDashRoute.uwPricingRequestReview}`,
        disabled: this.roleService.getPermissionLevel(PermissionType.UnderWriterAccess) < PermissionLevel.View,
      },
      {
        icon: 'settings',
        title: 'Rolling Deal Configuration',
        description: 'Configure the default restriction values of the rolling deal configuration.',
        route: `/${dataDashRoute.root}/${dataDashRoute.rollingDealConfiguration}`,
        disabled: this.roleService.getPermissionLevel(PermissionType.RollingDealConfiguration) < PermissionLevel.View,
      },
    ];
  }

  setCurrentPlatform(platform: Platform) {
    this.platform = platform;
  }
}
