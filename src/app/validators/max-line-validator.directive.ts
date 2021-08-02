import { Directive, Input } from '@angular/core';
import { ValidatorFn, AbstractControl, Validator, FormControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
  selector: '[maxLineValidator]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: MaxLineValidatorDirective, multi: true }
  ]
})
export class MaxLineValidatorDirective implements Validator {
  validator: ValidatorFn;
  @Input('maxLineValidator') maxLines: number;

  constructor() {
    this.validator = this.maxLineValidatorFunction();
  }

  validate(control: FormControl) {
    return this.validator(control);
  }

  maxLineValidatorFunction(): ValidatorFn {
    return (controller: AbstractControl) => {
      let str = controller.value;
      if (str) {
        let count = (str.match(/\r|\n/g) || []).length;
        if (count >= this.maxLines) {
          return {
            maxLineValidator: {
              valid: false
            }
          };
        }
        else {
          return null;
        }
      }

    }
  }
}
