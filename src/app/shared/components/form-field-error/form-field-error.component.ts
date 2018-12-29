import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-form-field-error',
  template: `
    <p class="text-danger">
      {{errorMessage}}
    </p>
  `,
  styleUrls: ['./form-field-error.component.css']
})
export class FormFieldErrorComponent implements OnInit {

  @Input('form-control') formControl: FormControl;

  constructor() { }

  ngOnInit() {
  }

  public get errorMessage(): string | null {
    if (this.mustShowErroMessage()) {
      return this.getErrorMessage();
    } else {
      return null;
    }
  }

  private mustShowErroMessage() : boolean {
    return this.formControl.touched && this.formControl.invalid;
  }

  private getErrorMessage() : string | null {
    if (this.formControl.errors.required) {
      return 'dado obrigatório';
    }
    else if (this.formControl.errors.minlength) {
      const requiredMinLength = this.formControl.errors.minlength.requiredLength;
      return `deve ter no mínimo ${requiredMinLength} caracter(es)`;
    }
    else if (this.formControl.errors.maxlength) {
      const requiredMaxLenggth = this.formControl.errors.maxlength.requiredLength;
      return `deve ter no máximo ${requiredMaxLenggth} caracter(es)`;      
    }
  }
}
