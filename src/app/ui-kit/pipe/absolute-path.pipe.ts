import { Pipe, PipeTransform } from '@angular/core';
import { absolutePath } from '../../core/utils/route.util';

@Pipe({
  name: 'absolutePath',
})
export class AbsolutePathPipe implements PipeTransform {
  transform(segments: any[], queryParams?: any): string {
    const basePath = absolutePath(segments.map((s) => String(s)));
    if (!queryParams) {
      return basePath;
    }

    const query = Object.keys(queryParams)
      .map((key) => `${key}=${queryParams[key]}`)
      .join('&');

    return `${basePath}?${query}`;
  }
}
