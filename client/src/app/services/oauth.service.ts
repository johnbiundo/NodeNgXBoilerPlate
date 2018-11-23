import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Profile, Provider, User } from '../models/user.model';
import { LinksService } from './links.service';





declare const FB: any;

@Injectable()
export class OAuthService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private links: LinksService,
    private ngZone: NgZone,
    private toastr: ToastrService
  ) {}

  // Note - the code for handling Google Sign In is in the Social Login component.

  linkFb() {
    return FB.login(
      result => {
        if (result.authResponse) {
          FB.api('/me', { fields: ['last_name', 'first_name', 'picture', 'email', 'id'] }, user =>
            this.ngZone.run(() => {
              this.directUpsert(
                { type: 'facebook', id: user.id },
                {
                  email: user.email,
                  lastName: user.last_name,
                  firstName: user.first_name,
                  avatar: user.picture.data.url
                }
              );
            })
          );
        }
      },
      { scope: 'public_profile,email' }
    );
  }

  linkGh() {
    window.location.href = `https://github.com/login/oauth/authorize?scope=user&client_id=${
      environment.ghClientId
    }`;
  }

  linkGhCb(code: String) {
    return this.http
      .post(`${environment.api}/oauth/link/gh`, { code: code })
      .toPromise()
      .then((res: ApiResponse) => {
        this.onLinkSuccess(res);
        return res;
      })
      .catch(err => err);
  }

  linkLi() {
    window.location.href = `https://www.linkedin.com/oauth/v2/authorization?client_id=${
      environment.liClientId
    }&redirect_uri=${environment.oauthUri}/linkedin&response_type=code&state=${Date.now()}`;
  }

  linkLiCb(code: String) {
    return this.http
      .post(`${environment.api}/oauth/link/li`, { code: code })
      .toPromise()
      .then((res: ApiResponse) => {
        this.onLinkSuccess(res);
        return res;
      })
      .catch(err => err);
  }

  directUpsert(provider: Provider, profile: Profile) {
    return this.http
      .post(`${environment.api}/oauth/link`, { provider: provider, profile: profile })
      .toPromise()
      .then((res: ApiResponse) => {
        this.onLinkSuccess(res);
        return res;
      })
      .catch(err => err);
  }

  onLinkSuccess(res: ApiResponse) {
    this.ngZone.run(() => {
      this.toastr.success('Sign In Success');
      localStorage.setItem('token', res.payload);
      this.links.resolve(res);
    });
  }

  unlink(user: User, provider: Provider) {
    return this.http
      .delete(`${environment.api}/oauth/${user._id}/link/${provider.type}`)
      .toPromise()
      .then((res: ApiResponse) => res)
      .catch(err => err);
  }
}
