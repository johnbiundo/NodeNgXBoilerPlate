import { AbstractControl, ValidatorFn } from '@angular/forms';
import { regex } from '../constants/regex';


export function mediaValidatorFn(ext: string): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      if (!control.value || control.value === '') {
        return null;
      }
      let invalid = false;
      switch (ext.toLowerCase()) {
        case 'mp4':
        invalid = !regex.mp4UrlRgx.test(control.value);
        break;
        case 'webm':
        invalid = !regex.webmUrlRgx.test(control.value);
        break;
        case 'hls':
        invalid = !regex.hlsUrlRgx.test(control.value);
        break;
        case 'poster':
        invalid = !regex.posterUrlRgx.test(control.value);
        break;
      }
      return invalid ? {'mediaValidator': {value: control.value}} : null;
    };
  }
