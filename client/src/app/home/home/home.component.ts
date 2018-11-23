import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../../models/user.model';
import { AccountService } from '../../services/account.service';
import { AppService } from '../../services/app.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  homeContent = [];
  user: User;
  contentSub: Subscription;
  sub: Subscription;
  constructor(private svc: AppService, private accountSvc: AccountService) {}

  ngOnInit() {
    this.contentSub = this.svc.getHomeContent().subscribe(res => (this.homeContent = res.payload.items));
    this.sub = this.accountSvc.self.subscribe(res => (this.user = res));
  }
}
