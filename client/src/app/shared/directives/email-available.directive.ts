import { Directive } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../../models/api-response.model';
import { AccountService } from '../../services/account.service';

@Directive({
  selector: '[appEmailAvailable]'
})
export class EmailAvailableDirective {
  static createValidator(svc: AccountService) {
    return (control: AbstractControl) => {
      return svc.checkEmailAvailability(control.value).pipe(
        map((res: ApiResponse) => {
          // Comes back as true - so we set it at taken only if its false.  (double negative)
          return res.payload ? null : { emailAvailable: false };
        })
      );
    };
  }
}
