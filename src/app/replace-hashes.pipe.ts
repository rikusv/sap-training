import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replaceHashes'
})
export class ReplaceHashesPipe implements PipeTransform {

  transform(value: string, replacement: string): any {
    if (!value) {
      return null;
    }
    if (!replacement) {
      return value;
    }
    return value.replace('##', replacement);
  }

}
