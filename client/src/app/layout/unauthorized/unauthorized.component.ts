import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-unauthorized',
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.scss']
})
export class UnauthorizedComponent implements OnInit {
  public isAuthenticated: Boolean;
  constructor(
    private location: Location,
    private router: Router,
    private acctSvc: AccountService
  ) {}
  ngOnInit() {
    this.acctSvc.isAuthenticated.subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
    });
  }

  goBack() {
    this.location.back();
  }
}
