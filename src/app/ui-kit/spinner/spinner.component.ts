import { Component, Input, OnInit } from '@angular/core';
import { Spinner } from './spinner';

@Component({
  selector: 'dd-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
})
export class SpinnerComponent implements OnInit {
  @Input() bgClass = 'bg-slate-200';
  @Input() message: string;
  @Input() spinner: Spinner;

  constructor() {}

  ngOnInit(): void {}
}
