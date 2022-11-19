import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'dd-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss'],
})
export class UploaderComponent {
  @Input() fileType: string;
  @Output() onFileUpload: EventEmitter<File> = new EventEmitter<File>();

  fileName: string = '';

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;
    this.fileName = files[0].name;
    this.onFileUpload.emit(files[0]);
  }
}
