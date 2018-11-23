import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccountService } from '../services/account.service';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  constructor(public svc: AccountService, public router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.svc.isAuthenticated.pipe(
      map(res => {
        if (!res) {
          this.router.navigate(['login']);
          return false;
        }
        return true;
      })
    );
  }
}
