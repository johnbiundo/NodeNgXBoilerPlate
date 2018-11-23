import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {
  public isAuthenticated: Boolean;
  constructor(private location: Location, private router: Router, private acctSvc: AccountService) { }

  ngOnInit() {
    this.acctSvc.isAuthenticated.subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
    });
  }

  goBack() {
    this.location.back();
  }

}
