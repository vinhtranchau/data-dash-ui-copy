import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'dd-dialog-layout',
  templateUrl: './dialog-layout.component.html',
  styleUrls: ['./dialog-layout.component.scss'],
})
export class DialogLayoutComponent implements OnInit {
  @Input() title = '';
  @Input() disabled = false;
  @Input() isLoading = false;

  @Output() save: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {}
}
