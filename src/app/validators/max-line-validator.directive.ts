import { Directive } from '@angular/core';
import { ValidatorFn, AbstractControl, Validator, FormControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
  selector: '[maxLineValidator]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: MaxLineValidatorDirective, multi: true }
  ]
})
export class MaxLineValidatorDirective implements Validator {
  validator: ValidatorFn;

  constructor() {
    this.validator = maxLineValidator();
   }
  
   validate(control: FormControl) {
    return this.validator(control);
  }

}

function maxLineValidator() : ValidatorFn {
  return (controller: AbstractControl) => {

    let str = controller.value;
    if(str) {
      let count = (str.match(/\r|\n/g) || []).length;
      if(count >= 20) {        
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
