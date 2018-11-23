import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiResponse } from '../../models/api-response.model';
import { User } from '../../models/user.model';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss'],
  providers: [AccountService]
})
export class ConfirmComponent implements OnInit, OnDestroy {
  searchString: string;
  user: User;
  confirmCode: string;
  precheckOk: boolean;
  private sub: any;
  error: ApiResponse;
  message: string;

  constructor(private svc: AccountService, private router: Router, private route: ActivatedRoute) {
    this.user = new User();
    this.user.profile = {
      email: ''
    };
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

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  precheck(searchString: string) {
    this.svc.precheck('CONFIRM', searchString).subscribe(res => {
      this.user = res.payload;
      if (this.user.status.confirmed) {
        this.router.navigate([res.action.href, { confirmed: 1 }]);
      }
      if (this.user.profile.email) {
        this.precheckOk = true;
      }
    });
  }

  dispatch() {
    this.error = undefined;
    this.message = undefined;
    if (this.precheckOk && !this.confirmCode) {
      this.error.message = 'No confirmation code entered.   Please try again.';
    }
    if (this.precheckOk && this.confirmCode) {
      this.confirm();
    }
    if (!this.precheckOk && this.user.profile.email) {
      this.precheck(this.user.profile.email);
    }
  }

  resend() {
    this.error = undefined;
    this.message = undefined;
    this.svc
      .resendCode('CONFIRM', this.user.profile.email)
      .toPromise()
      .then(res => {
        this.message = res.message;
      })
      .catch(err => (this.error = err.error || 'Error resending email.'));
  }

  confirm() {
    this.error = undefined;
    this.message = undefined;
    this.svc
      .confirm(this.confirmCode)
      .toPromise()
      .then(res => {
        return this.router.navigate([res.action.href, { confirmed: 1 }]);
      })
      .catch(err => {
        this.error = err.error || 'Error confirming your account.';
        if (err.error.action && err.error.action.rel === 'redirect') {
          return this.router.navigate([err.error.action.href]);
        }
      });
  }
}
