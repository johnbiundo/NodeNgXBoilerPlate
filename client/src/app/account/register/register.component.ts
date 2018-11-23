import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiResponse } from '../../models/api-response.model';
import { AccountService } from '../../services/account.service';
import { LinksService } from '../../services/links.service';
import { EmailAvailableDirective } from '../../shared/directives/email-available.directive';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [AccountService]
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  firstName: FormControl;
  lastName: FormControl;
  email: FormControl;
  password: FormControl;
  optInEmail: FormControl;
  company: FormControl;
  jobRole: FormControl;
  error: ApiResponse;

  constructor(
    private fb: FormBuilder,
    private svc: AccountService,
    private route: ActivatedRoute,
    private router: Router,
    private links: LinksService
            ) {
  }

  ngOnInit(): void {
    this.setupRegisterForm();
  }

  setupRegisterForm() {
    this.firstName = this.fb.control('', Validators.required);
    this.lastName = this.fb.control('', Validators.required);
    this.email = this.fb.control('', [Validators.required, Validators.email], EmailAvailableDirective.createValidator(this.svc));
    this.company = this.fb.control('', Validators.required);
    this.jobRole = this.fb.control('', Validators.required);
    this.password = this.fb.control('', [Validators.required]);
    this.optInEmail = this.fb.control('');

    this.registerForm = this.fb.group({
      password: this.password,
      profile: this.fb.group({
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        company: this.company,
        jobRole: this.jobRole
      }),
        status: this.fb.group({
          optInEmail: this.optInEmail
        })
    });
  }

  passwordEv(event) {
    this.registerForm.patchValue({
      password: event
    });
  }

  login() {
    return this.router.navigate(['login']);
  }

  gotoMain() {
    return this.router.navigate(['/']);
  }


  onSubmit({ value, valid }) {
    this.svc.register(value).then(res => {
      this.links.resolve(res);
    }).catch(err => {
      this.error = err.message;
    });
  }

}
