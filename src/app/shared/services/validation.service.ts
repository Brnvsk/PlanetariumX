import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor() { }

  static loginValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const nameRe = /^(?=.*[A-Za-z0-9]$)[A-Za-z][A-Za-z\d.-].+$/;
      const isValidLogin = nameRe.test(control.value);
      return !isValidLogin ? {invalid: true} : null;
    };
  }

  static passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const nameRe = /^(?=.*[!@#$&])(?=.*[0-9])(?=.*[a-z]).+$/;
      const isValidPassword = nameRe.test(control.value);
      return !isValidPassword ? {invalid: true} : null;
    };
  }
}
