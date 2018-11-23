import { Pipe, PipeTransform } from '@angular/core';
import { Link } from '../models/api-response.model';

@Pipe({
  name: 'link',
  pure: false
})
export class LinkPipe implements PipeTransform {

  transform(links: Array<Link>, rel: string): Link {
    return links.filter(link => link.rel === rel)[0];
  }

}
