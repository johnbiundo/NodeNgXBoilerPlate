import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiResponse } from '../../models/api-response.model';
import { Reset } from '../../models/reset.model';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  providers: [AccountService]
})
export class ResetPasswordComponent implements OnInit {
  searchString: string;
  reset: Reset;
  precheckOk: boolean;
  private sub: any;
  error: string;
  message: string;
  constructor(private svc: AccountService, private router: Router, private route: ActivatedRoute) {

    this.reset = new Reset();
    this.reset.profile = {
      email: ''
    };
    this.precheckOk = false;
  }

  ngOnInit() {
    this.precheckOk = false;
    this.sub = this.route.params.subscribe(params => {
      this.searchString = params['searchString'];
      if (this.searchString) {
        this.precheck(this.searchString);
      }
    });
  }

  passwordEv(event) {
    this.reset.password = event;
  }

  precheck(searchString: string) {
    this.svc.precheck('RESET', searchString).subscribe(res => {
      this.reset = res.payload;
      if (this.reset.profile.email) {
        this.precheckOk = true;
      }
    });
  }

  dispatch() {
    this.error = undefined;
    this.message = undefined;
    if (this.precheckOk && !this.reset.resetCode) {
      this.error = 'No reset code entered.   Please try again.';
    }
    if (this.precheckOk && this.reset.resetCode) {
      this.resetPassword();
    }
    if (!this.precheckOk && this.reset.profile.email) {
      this.precheck(this.reset.profile.email);
    }
  }

  resend() {
    this.error = undefined;
    this.message = undefined;
    this.svc.resendCode('RESET', this.reset.profile.email).toPromise().then((res: ApiResponse) => {
      this.message = res.message;
    }).catch(err => this.error = err.error);
  }

  resetPassword() {
    this.error = undefined;
    this.message = undefined;
    return this.svc.reset(this.reset).toPromise().then((res: ApiResponse) => {
      this.router.navigate([res.action.href, {reset: 1}]);
    }).catch(err => this.error = err.error);
  }

}
