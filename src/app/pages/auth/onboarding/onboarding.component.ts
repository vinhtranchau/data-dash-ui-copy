import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { ToastPriority } from '../../../ui-kit/toast/toast.model';
import { ToastService } from '../../../ui-kit/toast/toast.service';
import { changeStage } from './onboarding.model';

@Component({
  selector: 'dd-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss'],
})
export class OnboardingComponent implements OnInit {
  onboardingStage: number = 1;

  constructor(private router: Router, private toast: ToastService) {}

  ngOnInit(): void {}

  nextStage(event: boolean) {
    if (this.onboardingStage < 3) {
      this.onboardingStage += 1;
    } else {
      this.toast.success(
        "Welcome, you're all set up! Your answers can be changed anytime from the account menu.",
        ToastPriority.Medium
      );
      this.router.navigate(['/']).then();
    }
  }
}
