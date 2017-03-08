import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dasherize'
})
export class DasherizePipe implements PipeTransform {
  transform(value: string): string {
    return value.replace("_", "-");
  }
}
