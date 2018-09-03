import { Pipe, PipeTransform } from '@angular/core';
import { parse, Renderer } from 'marked';

@Pipe({
  name: 'markdown'
})
export class MarkdownPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return parse(value);
  }

}
