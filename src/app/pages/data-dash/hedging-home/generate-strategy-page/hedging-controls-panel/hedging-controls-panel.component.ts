import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {
  HedgingControl,
  Method,
  methodOptions,
  RiskMeasure,
  riskMeasureOptions,
  ScenarioGenerator,
  scenarioGeneratorOptions,
  Style,
  styleOptions,
} from '../../../../../core/models/hedging.model';
import { ToastService } from '../../../../../ui-kit/toast/toast.service';

@Component({
  selector: 'dd-hedging-controls-panel',
  templateUrl: './hedging-controls-panel.component.html',
  styleUrls: ['./hedging-controls-panel.component.scss'],
})
export class HedgingControlsPanelComponent implements OnInit {
  @Input() isDealConfiguratorValid = false;
  @Input() indexUUID: string;
  @Output() generateHedgingStrategy: EventEmitter<HedgingControl> = new EventEmitter<HedgingControl>();

  RiskMeasure = RiskMeasure;
  Style = Style;
  Method = Method;
  riskMeasureOptions = riskMeasureOptions;
  styleOptions = styleOptions;
  methodOptions = methodOptions;

  scenarioGeneratorOptions = scenarioGeneratorOptions;

  form: FormGroup = this.fb.group({
    risk_measure: ['', Validators.required],
    confidence_level: ['', Validators.required],
    threshold: ['', Validators.required],
    rebalancing_interval: ['', Validators.required],
    hedging_style: ['', Validators.required],
    method: ['', Validators.required],
    scenario_generator: [ScenarioGenerator.HS_BackTesting, Validators.required],
  });

  constructor(private fb: FormBuilder, private toast: ToastService) {}

  ngOnInit(): void {
    this.form.get('risk_measure')?.valueChanges.subscribe((value) => {
      const confidenceLevelControl = this.form.get('confidence_level');
      const thresholdControl = this.form.get('threshold');
      if (value === RiskMeasure.VaR || value === RiskMeasure.ES_CVaR) {
        confidenceLevelControl?.enable();
        confidenceLevelControl?.setValidators([Validators.min(0), Validators.max(1)]);
        confidenceLevelControl?.setValue(0.95);
      } else {
        confidenceLevelControl?.reset('N.A');
        confidenceLevelControl?.disable();
      }

      if (value === RiskMeasure.DownsideDeviation) {
        thresholdControl?.enable();
        thresholdControl?.setValidators([Validators.min(-0.999999999)]); // Strictly greater than -1
        thresholdControl?.setValue(0);
      } else {
        thresholdControl?.reset('N.A');
        thresholdControl?.disable();
      }
    });

    this.form.get('hedging_style')?.valueChanges.subscribe((value) => {
      const intervalControl = this.form.get('rebalancing_interval');
      if (value === Style.Dynamic) {
        intervalControl?.enable();
        intervalControl?.setValidators([Validators.min(1), Validators.pattern('^[0-9]*$')]);
        intervalControl?.setValue(1);
      } else {
        intervalControl?.reset('N.A');
        intervalControl?.disable();
      }
    });
  }

  submit() {
    const value = this.form.getRawValue();
    this.generateHedgingStrategy.emit(value);
  }
}
