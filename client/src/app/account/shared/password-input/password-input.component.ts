import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { User } from '../../../models/user.model';
import { AccountService } from '../../../services/account.service';
import { StrongPasswordValidator } from '../../../shared/strong-password';
@Component({
  selector: 'app-password-input',
  templateUrl: './password-input.component.html',
  styleUrls: ['./password-input.component.scss']
})
export class PasswordInputComponent implements OnInit {

  @Input()
  label = 'Password:';

  @Input()
 standalone = false;

  @Output()
  passwordEv = new EventEmitter();

  pwStr: ValidatorFn;
  passwordInp: FormGroup;
  password: FormControl;
  passwordVal: String;
  message: String;
  error: String;

  constructor(private fb: FormBuilder, private svc: AccountService) {
    this.pwStr = StrongPasswordValidator('2');
   }

  ngOnInit() {
    this.password = this.fb.control('', [Validators.required, this.pwStr]);
    this.passwordInp = this.fb.group({
      password: this.password
    });
    this.onChanges();
  }

  onChanges(): void {
    this.passwordInp.get('password').valueChanges.subscribe(val => {
      this.passwordEv.emit(val);
      this.passwordVal = val;
    });
  }

  onSubmit() {
    if (!this.standalone) {
      return;
    }
    this.svc.update({ password: this.passwordVal} as User).then(res => {
      this.message = res.message;
    }).catch(err => {
      this.error = err.message;
    });
  }

}
