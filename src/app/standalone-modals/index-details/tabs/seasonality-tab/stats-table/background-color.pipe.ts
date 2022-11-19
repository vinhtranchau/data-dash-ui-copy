import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'backgroundColor',
})
export class BackgroundColorPipe implements PipeTransform {
  minColorR = 255;
  minColorG = 211;
  minColorB = 181;
  midColorR = 255;
  midColorG = 170;
  midColorB = 166;
  maxColorR = 255;
  maxColorG = 140;
  maxColorB = 148;

  private static minMaxRatio(value: number, min: number, max: number, newMin: number, newMid: number, newMax: number) {
    const ratio = (value - min) / (max - min);
    if (ratio > 0.5) {
      return (2 * ratio - 1) * (newMax - newMid) + newMid;
    } else {
      return 2 * ratio * (newMid - newMin) + newMin;
    }
  }

  transform(value: number | null, minNum: number, maxNum: number): unknown {
    if (value) {
      return `rgba(
      ${BackgroundColorPipe.minMaxRatio(value, minNum, maxNum, this.minColorR, this.midColorR, this.maxColorR)},
      ${BackgroundColorPipe.minMaxRatio(value, minNum, maxNum, this.minColorG, this.midColorG, this.maxColorG)},
      ${BackgroundColorPipe.minMaxRatio(value, minNum, maxNum, this.minColorB, this.midColorB, this.maxColorB)})`;
    } else {
      return 'white';
    }
  }
}
