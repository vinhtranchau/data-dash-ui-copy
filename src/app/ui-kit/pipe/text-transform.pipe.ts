import { Pipe, PipeTransform } from '@angular/core';
import { TitleCasePipe } from '@angular/common';

@Pipe({
  name: 'textTransform',
})
export class TextTransformPipe implements PipeTransform {
  constructor(private titleCasePipe: TitleCasePipe) {}

  transform(value: string, ...options: string[]): string {
    if (value) {
      value = value.replaceAll('_', ' ');
      return this.titleCasePipe.transform(value);
    } else {
      return value;
    }
  }
}
