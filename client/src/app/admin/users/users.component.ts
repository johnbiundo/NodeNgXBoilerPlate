import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Link } from '../../models/api-response.model';
import { User } from '../../models/user.model';
import { AccountService } from '../../services/account.service';
import { LinksService } from '../../services/links.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class AdminUsersComponent implements OnInit, OnDestroy {
  _users: Array<User>;
  users: Array<User>;
  records = 0;
  collection: number;
  sub: Subscription;
  filter = { text: '', confirmed: false, marketing: false };
  disableScroll = false;
  constructor(private svc: AccountService, private router: Router, private links: LinksService) {
    this.users = [];
  }

  ngOnInit() {
    this.getUsers();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  gotoPage(user: User) {
    return (window.location.href = user.$adminLinks.filter(
      (_link: Link) => _link.rel === 'page'
    )[0].href);
  }

  dispatch(action: Link, user: User) {
    this.links.userAction(action, user).subscribe(res => this.getUsers());
  }

  search() {
    this.records = 0;
    let filterText = '';
    let filterConfirmed = false;
    let filterMarketing = false;
    if (this.filter.text !== '') {
      filterText = this.filter.text;
    }
    if (this.filter.confirmed) {
      filterConfirmed = this.filter.confirmed;
    }
    if (this.filter.marketing) {
      filterMarketing = this.filter.marketing;
    }
    return this.getUsers(filterText, filterMarketing, filterConfirmed);
  }

  getUsers(filterText?: string, filterMarketing?: boolean, filterConfirmed?: boolean) {
    this.users = [];
    this.sub = this.svc
      .getUsers(this.records, filterText, filterMarketing, filterConfirmed)
      .subscribe(users => {
        if (users.payload.$records < 25) {
          this.disableScroll = true;
        }
        for (const user of users.payload) {
          this.users.push(user);
        }
        this.collection = users.$collectionSize;
        this.records += users.$records;
      });
  }

  onScroll() {
    this.search();
  }

  export() {}
}
