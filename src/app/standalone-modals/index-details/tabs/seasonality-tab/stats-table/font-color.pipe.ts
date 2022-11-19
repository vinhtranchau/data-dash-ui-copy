import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fontColor',
})
export class FontColorPipe implements PipeTransform {
  transform(value: number | null, minNum: number, maxNum: number): string {
    if (value) {
      const ratio = (value - minNum) / (maxNum - minNum);
      if (ratio > 0.55) {
        return 'white';
      } else {
        return 'black';
      }
    } else {
      return 'black';
    }
  }
}
