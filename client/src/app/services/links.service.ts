import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse, Link } from '../models/api-response.model';
import { User } from '../models/user.model';

@Injectable()
export class LinksService {
  constructor(private router: Router, private http: HttpClient, private toastr: ToastrService) {}

  resolve(res: ApiResponse): void {
    if (!res.action) {
      return;
    }
    if (res.action) {
      switch (res.action.rel) {
        case 'redirect':
          this.redirect(res.action);
          break;
        case 'clearToken':
          this.clearToken();
          break;
        default:
          break;
      }
    }
  }

  userAction(action: Link, user: User): Observable<ApiResponse> {
    if (action.method) {
      return this.httpMethod(action).pipe(
        map(res => {
          this.toastr.success(res.message);
          return res;
        })
      );
    }
  }

  redirect(action: Link): Promise<boolean> {
    if (!action.param && !action.params) {
      return this.router.navigate([action.href]);
    } else if (action.param) {
      return this.router.navigate([action.href, action.param]);
    } else {
      const parts: [String] = [action.href];
      for (const part of action.params) {
        parts.push(part);
        console.log(part);
      }
      return this.router.navigate(parts);
    }
  }

  clearToken() {
    localStorage.removeItem('token');
  }

  httpMethod(action: Link): Observable<ApiResponse> {
    switch (action.method.toString().toUpperCase()) {
      case 'GET':
        return this.http.get(action.href).pipe(map((res: ApiResponse) => res));
      case 'PUT':
        return this.http.put(action.href, {}).pipe(map((res: ApiResponse) => res));
      case 'POST':
        return this.http.post(action.href, {}).pipe(map((res: ApiResponse) => res));
      case 'PATCH':
        return this.http.patch(action.href, {}).pipe(map((res: ApiResponse) => res));
      case 'DELETE':
        return this.http.delete(action.href).pipe(map((res: ApiResponse) => res));
    }
  }

  goToLink(links: Array<Link>, rel: string) {


  }
}
