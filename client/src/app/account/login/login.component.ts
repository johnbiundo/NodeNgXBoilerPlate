import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiResponse } from '../../models/api-response.model';
import { User } from '../../models/user.model';
import { AccountService } from '../../services/account.service';
import { LinksService } from '../../services/links.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [AccountService]
})
export class LoginComponent implements OnInit {
  error: ApiResponse;
  user: User;
  persistLogin: Boolean;
  confirmed: Boolean;
  reset: Boolean;
  sub: Subscription;

  constructor(
    private svc: AccountService,
    private links: LinksService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.user = new User();
    this.user.profile = {
      email: ''
    };
    this.user.password = '';
    this.persistLogin = true;
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.confirmed = params['confirmed'];
      this.reset = params['reset'];
    });
  }

  onSubmit(f: NgForm) {
    this.svc
      .login(this.user)
      .toPromise()
      .then(res => {
        localStorage.setItem('persistLogin', this.persistLogin.toString());
        localStorage.setItem('token', res.payload);
        this.links.resolve(res);
      })
      .catch(err => {
        this.error = err.error.message;
        if (err.error.action) {
          this.links.resolve(err.error);
        }
      });
  }

  forgotPassword() {
    return this.router.navigate(['forgot-password']);
  }

  register() {
    return this.router.navigate(['register']);
  }
}
