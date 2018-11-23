import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable()
export class UtilityService {
  constructor(private http: HttpClient) {}

  slugify(str: String): String {
    return str
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/[^\w\-]+/g, '') // Remove all non-word chars
      .replace(/\-\-+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, '');
  }

  ping() {
    return this.http.get(`${environment.root}/external/ping`).pipe(map(res => res));
  }
}
