import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minutes',
})
export class SecondsToMinutesPipe implements PipeTransform {
  transform(value: number): string {
    if (typeof value !== 'number') {
      return '';
    }
    const minutes = Math.floor(value / 60);
    const seconds = value % 60;

    const minutesText = minutes < 10 ? '0' + minutes : minutes;
    const secondsText = seconds < 10 ? '0' + seconds : seconds;

    return minutesText + ':' + secondsText;
  }
}
