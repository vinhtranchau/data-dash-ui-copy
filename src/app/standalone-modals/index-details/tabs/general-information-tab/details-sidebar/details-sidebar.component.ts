import { Component, Input, OnInit } from '@angular/core';
import { IndexFlattened, ProxyType, seasonalityVerdictLabels } from '../../../../../core/models/index.model';
import { Observable } from 'rxjs';
import { LoadingSpinnerElement } from '../../../../../ui-kit/spinner/spinner';

@Component({
  selector: 'dd-details-sidebar',
  templateUrl: './details-sidebar.component.html',
  styleUrls: ['./details-sidebar.component.scss'],
})
export class DetailsSidebarComponent implements OnInit {
  ProxyType = ProxyType;
  seasonalityVerdictLabels = seasonalityVerdictLabels;
  @Input() indexDetails$: Observable<IndexFlattened>;
  @Input() spinner: LoadingSpinnerElement;

  ngOnInit(): void {
  }
}
