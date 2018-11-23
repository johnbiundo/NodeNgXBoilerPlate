import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor() { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (localStorage.getItem('token')) {
            req = req.clone({
                setHeaders: {
                    authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
        }
        return next.handle(req);
    }
}
