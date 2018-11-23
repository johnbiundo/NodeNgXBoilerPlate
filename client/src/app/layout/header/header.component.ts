import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faPalette } from '@fortawesome/free-solid-svg-icons';
import { environment } from '../../../environments/environment';
import { User } from '../../models/user.model';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [AccountService]
})
export class HeaderComponent implements OnInit {
  faPalette = faPalette;
  public user: User;
  public title = environment.title;
  public isAuthenticated: Boolean;
  public isCollapsed = true;

  constructor(private svc: AccountService, private router: Router) {}

  ngOnInit() {
    this.svc.isAuthenticated.subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
      if (this.isAuthenticated) {
        this.svc.self.subscribe(user => {
          this.user = user;
        });
      }
    });
  }

  gotoProfile() {
    this.router.navigate(['profile']);
  }

  gotoAdmin() {
    this.router.navigate(['admin']);
  }
  gotoManageStyles() {
    this.router.navigate(['styles']);
  }

  gotoNew() {
    this.router.navigate(['app', 'new']);
  }

  logout() {
    this.svc.logout();
  }
}
