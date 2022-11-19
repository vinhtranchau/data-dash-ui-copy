import { Component, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ContactUsMessage } from '../../../../core/models/contact-us.model';
import { ContactUsService } from '../../../../core/services/contact-us.service';
import { LocalStorageService } from '../../../../core/services/local-storage.service';
import { ToastService } from '../../../../ui-kit/toast/toast.service';

@Component({
  selector: 'dd-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss'],
})
export class HelpComponent implements OnInit {
  isLoading = false;

  form: UntypedFormGroup = this.fb.group({
    subject: [null, Validators.required],
    message: [null, Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private contactUsService: ContactUsService,
    private toastService: ToastService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {}

  async submit() {
    try {
      this.isLoading = true;
      const payload = {
        name: this.localStorageService.getUser().name,
        email: this.localStorageService.getUser().email,
        subject: this.form.get('subject')?.value,
        message: this.form.get('message')?.value,
      };
      await firstValueFrom(this.contactUsService.submitMessage(payload as ContactUsMessage));
      this.toastService.success('Message sent!');
    } catch (e) {
      this.toastService.error('Something went wrong!');
    } finally {
      this.isLoading = false;
    }
  }
}
