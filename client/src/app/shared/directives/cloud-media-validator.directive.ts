import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator } from '@angular/forms';
import { mediaValidatorFn } from '../functions/media-validator.fn';

@Directive({
  selector: '[appCloudMediaValidator]',
  providers: [{provide: NG_VALIDATORS, useExisting: CloudMediaValidatorDirective, multi: true}]
})
export class CloudMediaValidatorDirective implements Validator {
  @Input('appCloudMediaValidator') extension: string;
  validate(control: AbstractControl): {[key: string]: any} | null {
    return control.value ? mediaValidatorFn(this.extension)(control) : null;
  }
}
