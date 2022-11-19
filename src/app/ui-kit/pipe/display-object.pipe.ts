import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'displayObject',
})
export class DisplayObjectPipe implements PipeTransform {
  transform(object: any, includeKeys?: string[]): string {
    let returnString: string = '';
    if (!includeKeys) {
      includeKeys = Object.keys(object);
    }
    includeKeys.forEach((key) => (returnString += `${key}: ${object[key]}, `));
    return returnString.slice(0, -2);
  }
}
