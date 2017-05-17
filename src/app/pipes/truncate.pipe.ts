import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {
  transform(value: string): string {
    const length = 18;
    if (value.length > length) {
      return value.substring(0, length) + "...";
    }
    return value;
  }
}
