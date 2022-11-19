import { Component, Input, OnInit } from '@angular/core';
import { Icon } from './icon';

@Component({
  selector: 'dd-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
})
export class IconComponent implements OnInit {
  @Input() size = 128;
  @Input() name: Icon = 'barley';

  constructor() {}

  ngOnInit(): void {}
}
