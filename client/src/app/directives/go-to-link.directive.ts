import { Directive, HostListener, Input } from '@angular/core';
import { goToLink } from '../shared/functions/link.fn';

@Directive({
  selector: '[appGoToLink]'
})
export class GoToLinkDirective {

  /** Add this directive to a clickable element and pass in a rel, takes user to the href specified for the rel.   Handy.
   * @param Object<Any> - an object with an array of links attached (must be named $links)
   * @param rel string - the string representation of a link relationship to navigate to.   Defaults to 'page'
   * @example `[appGoToLink]="user"` - Passing in just an object would navigate to the users page on click.
   * @example `[appGoToLink]="user" rel="messages"` - Pass in a user object with $links prop and navigate to the href specified with the 'messages' el
   *
   */

  constructor() { }

  @Input() appGoToLink: any;
  @Input() rel: string;

  _rel = this.rel ? this.rel : 'page';

  @HostListener('click', ['$event']) onclick($event) {
    $event.preventDefault();
    $event.stopPropagation();
    goToLink(this.appGoToLink.$links, this._rel);
  }

}
