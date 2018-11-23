import { AfterViewInit, Component, ElementRef, Input, NgZone, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { OAuthService } from '../../../services/oauth.service';

declare const gapi: any;
declare const window: any;
declare const FB: any;
@Component({
  selector: 'app-social-login',
  templateUrl: './social-login.component.html',
  styleUrls: ['./social-login.component.scss'],
  providers: [OAuthService]
})
export class SocialLoginComponent implements OnInit, AfterViewInit {
  @Input() settingsMode = false;
  //  Google Stuff

  public auth2: any;

  public googleInit() {
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: environment.gClientId,
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });
      this.attachSignin(this.element.nativeElement.firstChild);
    });
  }

  public attachSignin(element) {
    this.auth2.attachClickHandler(
      element,
      {},
      googleUser => {
        const profile = googleUser.getBasicProfile();
        this.svc.directUpsert(
          { type: 'google', id: profile.getId() },
          {
            email: profile.getEmail(),
            lastName: profile.getFamilyName(),
            firstName: profile.getGivenName(),
            avatar: profile.getImageUrl()
          }
        );
      },
      function(error) {
        console.log(JSON.stringify(error, undefined, 2));
      }
    );
  }

  // End Google Stuff

  constructor(private svc: OAuthService, private ngZone: NgZone, private element: ElementRef) {
    // This function initializes the FB variable
    (function(d, s, id) {
      let js;
      const fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = '//connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');

    window.fbAsyncInit = () => {
      FB.init({
        appId: environment.fbClientId,
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v2.12'
      });
      FB.AppEvents.logPageView();
    };
  }

  ngAfterViewInit() {
    this.googleInit();
  }

  ngOnInit() {}

  loginLi() {
    return this.svc.linkLi();
  }

  loginGh() {
    return this.svc.linkGh();
  }

  loginFb() {
    this.svc.linkFb();
  }
}
