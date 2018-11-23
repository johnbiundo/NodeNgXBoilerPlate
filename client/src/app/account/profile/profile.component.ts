import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Provider, Providers, User } from '../../models/user.model';
import { AccountService } from '../../services/account.service';
import { OAuthService } from '../../services/oauth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [OAuthService]
})
export class ProfileComponent implements OnInit,OnDestroy {
  state: String;
  showRemoveMeConfirm: Boolean;
  user: User;
  unlinkError: String;
  paramSub: Subscription;
  sub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private svc: AccountService,
    private toastr: ToastrService,
    private oauth: OAuthService
  ) {
    this.showRemoveMeConfirm = false;
    this.user = new User();
    this.user.providers = new Providers();
    this.user.providers.facebook = new Provider();
    this.user.providers.google = new Provider();
    this.user.providers.linkedin = new Provider();
    this.user.providers.github = new Provider();
  }

  ngOnInit() {
    this.paramSub = this.route.paramMap.subscribe(params => {
      this.state = params.get('state');
    });
    this.sub = this.svc.self.subscribe(user => (this.user = user));
  }

  removeMe() {
    this.showRemoveMeConfirm = true;
  }

  unlink(provider: String) {
    const _provider: Provider = new Provider();
    _provider.type = provider.toString();
    this.svc.self.subscribe(user => {
      this.oauth.unlink(user, _provider).catch(err => (this.unlinkError = err));
    });
    this.toastr.success(`${provider} has been unlinked from your account.`);
  }

  removeMeConfirm() {
    this.toastr.success('We are sad to see you go!', 'Account Removed');
    this.svc.remove();
  }

  removeMeCancel() {
    this.showRemoveMeConfirm = false;
  }

  ngOnDestroy(): void {
    this.paramSub.unsubscribe();
    this.sub.unsubscribe();
  }
}
