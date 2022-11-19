import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionChange } from '@angular/cdk/collections';

import { QuantPortfolio } from '../../../../../core/models/quant-portfolio.model';
import { TableColumn } from '../../../../../ui-kit/table/table.model';

@Component({
  selector: 'dd-portfolio-summary-table',
  templateUrl: './portfolio-summary-table.component.html',
  styleUrls: ['./portfolio-summary-table.component.scss'],
})
export class PortfolioSummaryTableComponent implements OnInit {
  @Input() dataSource: MatTableDataSource<QuantPortfolio>;
  @Input() isLoading = false;

  @Output() changeSelection: EventEmitter<QuantPortfolio | undefined> = new EventEmitter();

  columns: TableColumn[] = [
    {
      name: 'name',
      content: 'name',
      title: 'Account',
    },
    {
      name: 'currency',
      content: 'currency',
      title: 'Currency',
    },
    {
      name: 'price',
      content: 'price',
      title: 'Value',
    },
    {
      name: 'price_change_text',
      content: 'price_change_text',
      title: '% Change',
    },
  ];

  displayedColumns = this.columns.map((x) => x.name);

  constructor() {}

  ngOnInit(): void {}

  onChangeSelection(event: SelectionChange<QuantPortfolio>) {
    const selectedPortfolio = event.added[0];
    this.changeSelection.emit(selectedPortfolio);
  }
}
