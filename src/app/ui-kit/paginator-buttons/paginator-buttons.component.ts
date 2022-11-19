import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'dd-paginator-buttons',
  templateUrl: './paginator-buttons.component.html',
  styleUrls: ['./paginator-buttons.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginatorButtonsComponent {
  @Input() text: string;
  @Input() direction: 'up' | 'down' | 'left' | 'right';
  @Output() click: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}
}
