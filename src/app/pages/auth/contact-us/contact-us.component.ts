import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ContactUsService } from '../../../core/services/contact-us.service';
import { ToastService } from '../../../ui-kit/toast/toast.service';

@Component({
  selector: 'dd-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss'],
})
export class ContactUsComponent implements OnInit {
  isLoading = false;

  form: UntypedFormGroup = this.fb.group({
    name: [null, Validators.required],
    email: [null, [Validators.required, Validators.email]],
    subject: [null, Validators.required],
    message: [null, Validators.required],
  });

  constructor(
    private fb: UntypedFormBuilder,
    private toastService: ToastService,
    private contactUsService: ContactUsService
  ) {}

  ngOnInit(): void {}

  async submit() {
    try {
      this.isLoading = true;
      await firstValueFrom(this.contactUsService.submitMessage(this.form.value));
      this.toastService.success('Message sent!');
    } catch (e) {
      this.toastService.error('Something went wrong!');
    } finally {
      this.isLoading = false;
    }
  }
}
