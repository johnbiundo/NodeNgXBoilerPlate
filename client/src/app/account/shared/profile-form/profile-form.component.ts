import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Profile, Status, User } from '../../../models/user.model';
import { AccountService } from '../../../services/account.service';

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss'],
  providers: [AccountService]
})
export class ProfileFormComponent implements OnInit {
  @Input()
  userId: string;
  user: User;
  profileForm: FormGroup;
  firstName: FormControl;
  lastName: FormControl;
  email: FormControl;
  optInEmail: FormControl;
  company: FormControl;
  jobRole: FormControl;
  error: string;
  message: string;
  public readonly = false;

  constructor(private svc: AccountService, public fb: FormBuilder) {
    this.user = new User();
    this.user.profile = new Profile();
    this.user.status = new Status();
  }

  ngOnInit() {
    this.createForm();
    if (!this.userId) {
      this.svc.self.subscribe(user => {
        this.user = user;
        this.populate();
      });
    }
    if (this.userId) {
      this.svc.getUserById(this.userId).subscribe(user => {
        this.user = user.payload;
        this.readonly = true;
        this.populate();
      });
      this.profileForm.disable();
    }
  }

  createForm() {
    this.firstName = this.fb.control('', Validators.required);
    this.lastName = this.fb.control('', Validators.required);
    this.email = this.fb.control('', [Validators.required, Validators.email]);
    this.company = this.fb.control('', Validators.required);
    this.jobRole = this.fb.control('', Validators.required);
    this.optInEmail = this.fb.control('');
    this.profileForm = this.fb.group({
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

  populate() {
    this.profileForm.patchValue({
      profile: {
        firstName: this.user.profile.firstName,
        lastName: this.user.profile.lastName,
        email: this.user.profile.email,
        company: this.user.profile.company,
        jobRole: this.user.profile.jobRole
      },
      status: {
        optInEmail: this.user.status.optInEmail
      }
    });
  }

  onSubmit(form, valid) {
    this.error = undefined;
    this.svc
      .update(form.value)
      .then(res => {
        this.message = res.message;
      })
      .catch(err => (this.error = err.error.message));
  }
}
