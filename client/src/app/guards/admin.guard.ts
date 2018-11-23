import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccountService } from '../services/account.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(public svc: AccountService, public router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.svc.self.pipe(
      map(user => {
        console.log(user);
        if (!user.isAdmin) {
          this.router.navigate(['unauthorized']);
          return false;
        }
        return true;
      })
    );
  }
}
