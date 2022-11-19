import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'dd-error-handler',
  templateUrl: './error-handler.component.html',
  styleUrls: ['./error-handler.component.scss'],
})
export class ErrorHandlerComponent implements OnInit {
  @Input() bgClass = 'bg-white';
  @Input() message: string;
  @Input() hasError: boolean = false;

  constructor() {}

  ngOnInit(): void {}
}
