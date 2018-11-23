import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { timer } from 'rxjs/internal/observable/timer';
import { catchError, delay, map, shareReplay, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Reset } from '../models/reset.model';
import { User } from '../models/user.model';
import { LinksService } from './links.service';

declare const FB: any;
declare const IN: any;

const CACHE_SIZE = 1;
const REFRESH_INTERVAL = 1000 * 60 * 30;

@Injectable()
export class AccountService {
  $user: Observable<User>;
  $isAuthenticated: Observable<Boolean>;
  $id: String;
  $role: String;

  constructor(private http: HttpClient, private router: Router, private links: LinksService) {}

  get isAuthenticated(): Observable<Boolean> {
    const timer$ = timer(0, REFRESH_INTERVAL);
    this.$isAuthenticated = timer$.pipe(
      switchMap(_ => this.getIsAuthenticated()),
      shareReplay(CACHE_SIZE)
    );
    return this.$isAuthenticated;
  }

  private getIsAuthenticated(): Observable<Boolean> {
    return this.http.get<ApiResponse>(`${environment.api}/auth/self`).pipe(
      map((res: ApiResponse) => {
        this.$id = res.payload;
        return !!res.payload;
      }),
      catchError((err: HttpErrorResponse) => of<Boolean>(false))
    );
  }

  get self() {
    if (!this.$user) {
      const timer$ = timer(0, REFRESH_INTERVAL);
      this.$user = timer$.pipe(
        switchMap(_ => this.getSelf()),
        shareReplay(CACHE_SIZE)
      );
    }
    return this.$user;
  }

  private getSelf(): Observable<User> {
    const uri = this.$id ? `${environment.api}/account/${this.$id}` : `${environment.api}/account/self`;
    return this.http
      .get(uri)
      .pipe(map((res: ApiResponse) => res.payload));
  }

  update(user: User) {
    return this.http
      .put(`${environment.api}/account/${this.$id}`, user)
      .pipe(map((res: ApiResponse) => res))
      .toPromise();
  }
  remove() {
    return this.http
      .delete(`${environment.api}/account/${this.$id}`)
      .toPromise()
      .then((res: ApiResponse) => {
        localStorage.removeItem('token');
        this.router.navigate(['/']);
      });
  }

  register(user: User): Promise<ApiResponse> {
    return this.http
      .post(`${environment.api}/account/register`, user)
      .toPromise()
      .then((res: ApiResponse) => res);
  }

  checkEmailAvailability(email: string) {
    return this.http.get(`${environment.api}/account/available/${email}`).pipe(
      delay(1000),
      map((res: ApiResponse) => res)
    );
  }

  precheck(type: string, searchString: string): Observable<ApiResponse> {
    return this.http
      .get(`${environment.api}/account/precheck/${type}/${searchString}`)
      .pipe(map((res: ApiResponse) => res));
  }

  login(user: User) {
    return this.http.post(`${environment.api}/account/login`, user).pipe(
      map((res: ApiResponse) => {
        localStorage.setItem('token', res.payload);
        const timer$ = timer(0, REFRESH_INTERVAL);
        this.$isAuthenticated = timer$.pipe(
          switchMap(_ => this.getIsAuthenticated()),
          shareReplay(CACHE_SIZE)
        );
        this.$user = timer$.pipe(
          switchMap(_ => this.getSelf()),
          shareReplay(CACHE_SIZE)
        );
        return res;
      })
    );
  }

  confirm(code: string) {
    return this.http
      .put(`${environment.api}/account/confirm/${code}`, {})
      .pipe(map((res: ApiResponse) => res));
  }

  resendCode(type: string, searchString: string) {
    return this.http
      .put(`${environment.api}/account/resend`, { type: type, searchString: searchString })
      .pipe(map((res: ApiResponse) => res));
  }

  forgotPassword(user: User) {
    return this.http
      .post(`${environment.api}/account/forgot`, user)
      .pipe(map((res: ApiResponse) => res));
  }

  reset(reset: Reset) {
    return this.http
      .put(`${environment.api}/account/reset/${reset.resetCode}`, reset)
      .pipe(map((res: ApiResponse) => res));
  }

  logout() {
    localStorage.removeItem('token');
    this.$isAuthenticated = undefined;
    this.router.navigate(['login']);
  }

  sso(user: User) {
    return this.http
      .post(`${environment.root}/external/sso`, user)
      .toPromise()
      .then((res: ApiResponse) => {
        localStorage.setItem('token', res.payload);
        return res;
      });
  }

  generateApiKeys() {
    return this.http
      .post(`${environment.root}/external/keys`, {})
      .toPromise()
      .then((res: ApiResponse) => res);
  }

  getApiKeys() {
    return this.http
      .get(`${environment.root}/external/keys`, {})
      .pipe(map((res: ApiResponse) => res));
  }

  updateApiKeys(key) {
    return this.http
      .put(`${environment.root}/external/keys`, key)
      .toPromise()
      .then((res: ApiResponse) => res);
  }

  getUserById(id: string) {
    return this.http
      .get(`${environment.api}/admin/account/${id}`, {})
      .pipe(map((res: ApiResponse) => res));
  }

  getUsers(
    skip: number,
    filterText?: string,
    filterMarketing?: boolean,
    filterConfirmed?: boolean
  ): Observable<ApiResponse> {
    let uri = `${environment.api}/admin/accounts?skip=${skip}`;
    if (filterText && filterText !== '') {
      uri = `${uri}&search=${encodeURIComponent(filterText)}`;
    }
    if (filterConfirmed) {
      uri = `${uri}&confirmed=${filterConfirmed}`;
    }
    if (filterMarketing) {
      uri = `${uri}&marketing=${filterMarketing}`;
    }
    return this.http.get(uri).pipe(map((res: ApiResponse) => res));
  }
}
