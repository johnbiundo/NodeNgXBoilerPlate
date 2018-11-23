import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../models/user.model';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  providers: [AccountService]
})
export class ForgotPasswordComponent implements OnInit {
  user: User;
  private sub: any;
  error: string;
  message: string;
  constructor(private svc: AccountService, private router: Router, private route: ActivatedRoute) {

    this.user = new User();
    this.user.profile = {
      email: ''
    };
  }

  ngOnInit() {
  }

  onSubmit(f) {
    this.error = undefined;
    this.svc.forgotPassword(this.user).toPromise().then(res => {
      this.router.navigate([res.action.href, res.action.param]);
    }).catch((err: HttpErrorResponse) => {
      this.error = err.error;
    });
  }

}
