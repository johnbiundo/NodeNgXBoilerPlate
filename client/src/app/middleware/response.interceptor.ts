import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LinksService } from '../services/links.service';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {
  constructor(private svc: LinksService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            // do stuff with response if you want
          }
        },
        (err: any) => {
          if (err instanceof HttpErrorResponse) {
            console.log(err);
            console.log(err.status);
            console.log(err.statusText);
            if (err.status === 401) {
              // redirect to the login route
              // or show a modal
              console.log('Error: Unauthorized');
              console.log(err);
              // this.router.navigate(['login']);
              if (err.error.action) {
                this.svc.resolve(err.error);
              }
            }
            if (err.status === 500 || err.status === 0) {
              console.log(err.statusText);
              this.router.navigate(['error']);
              if (err.error.action) {
                this.svc.resolve(err.error);
              }
            }
          }
        }
      )
    );
  }
}
