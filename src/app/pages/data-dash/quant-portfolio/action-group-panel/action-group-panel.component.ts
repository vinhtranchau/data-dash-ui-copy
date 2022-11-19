import { Component, OnInit } from '@angular/core';

import { dataDashRoute } from '../../../../core/routes/data-dash.route';

@Component({
  selector: 'dd-action-group-panel',
  templateUrl: './action-group-panel.component.html',
  styleUrls: ['./action-group-panel.component.scss'],
})
export class ActionGroupPanelComponent implements OnInit {
  dataDashRoute = dataDashRoute;

  constructor() {}

  ngOnInit(): void {}
}
