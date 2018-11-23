import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api-response.model';

@Injectable()
export class AppService {
  constructor(private http: HttpClient) {}
  getHomeContent() {
    return this.http.get(`${environment.api}/content/home`).pipe(map((res: ApiResponse) => res));
  }
}
