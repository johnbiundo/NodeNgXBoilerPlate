import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Profile, Provider, Providers, User } from '../../models/user.model';
import { AccountService } from '../../services/account.service';
import { LinksService } from '../../services/links.service';

@Component({
  selector: 'app-sso',
  templateUrl: './sso.component.html',
  styleUrls: ['./sso.component.scss']
})
export class SsoComponent implements OnInit {

  user: User;
  error: String;
  message: String;

  constructor(private svc: AccountService, private links: LinksService, private route: ActivatedRoute) {
    this.user = new User();
    this.user.profile = new Profile();
    this.user.providers = new Providers();
    this.user.providers.sso = new Provider();
  }

  //https://localhost:4200/sso?email=testing@mysampleapp.io&first=taylor&last=ackley&id=xx&token=mysampleapp

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      this.user.profile.email = params.get('email');
      this.user.profile.firstName = params.get('first');
      this.user.profile.lastName = params.get('last');
      this.user.providers.sso.id = params.get('id');
      this.user.providers.sso.token = params.get('token');
      this.svc.sso(this.user).then(res => {
        console.log(res)
        this.message = 'Redirecting you...'
        this.links.resolve(res);
      }).catch(err => {
        this.error = err.error;
      });
    });

  }

}
