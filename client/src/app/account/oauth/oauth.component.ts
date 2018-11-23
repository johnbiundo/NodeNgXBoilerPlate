import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LinksService } from '../../services/links.service';
import { OAuthService } from '../../services/oauth.service';

@Component({
  selector: 'app-oauth',
  templateUrl: './oauth.component.html',
  styleUrls: ['./oauth.component.scss']
})
export class OAuthComponent implements OnInit {
  error: String;
  message: String;
  constructor(
    private route: ActivatedRoute,
    private links: LinksService,
    private svc: OAuthService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.message = `Requesting your profile information for ${params.get('provider')}`;
      this.route.queryParamMap.subscribe(query => {
        switch (params.get('provider')) {
          case 'github':
            this.svc.linkGhCb(query.get('code')).catch(err => this.onLinkError(err));
            break;
          case 'google':
            break;
          case 'linkedin':
            this.svc.linkLiCb(query.get('code')).catch(err => this.onLinkError(err));
            break;
          default:
            this.error = 'Error determining oAuth provider.';
            break;
        }
      });
    });
  }

  onLinkError(err) {
    this.error = err.error;
  }
}
