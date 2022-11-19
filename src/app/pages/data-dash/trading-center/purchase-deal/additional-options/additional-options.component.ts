import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AdditionalOptionsForm } from '../../../../../core/strict-typed-forms/trading-center.form';

@Component({
  selector: 'dd-additional-options',
  templateUrl: './additional-options.component.html',
  styleUrls: ['./additional-options.component.scss']
})
export class AdditionalOptionsComponent implements OnInit {
  @Input() form: FormGroup<AdditionalOptionsForm>;

  constructor() { }

  ngOnInit(): void {
  }

}
