import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export const unauthorized_resource = {
  url: 'https://run.mocky.io/v3/ca72c05d-cacc-4481-b3ad-f8472f427209',
  delete: 'https://designer.mocky.io/manage/delete/ca72c05d-cacc-4481-b3ad-f8472f427209/secret'
}

export const refreshtoken_resource = {
  // url: 'https://run.mocky.io/v3/c5df604b-77c3-49a6-96fb-9a72eec32e66?mocky-delay=2000ms&refresh=true',

  url: 'https://run.mocky.io/v3/ca72c05d-cacc-4481-b3ad-f8472f427209?refresh=true',
  delete: 'https://designer.mocky.io/manage/delete/c5df604b-77c3-49a6-96fb-9a72eec32e66/secret'
}

@Injectable({
  providedIn: 'root'
})
export class MocksService {

  constructor(private http: HttpClient) { }

  calltounauthorized(options: { skipInterceptor: boolean } = { skipInterceptor: false }): Observable<any> {
    let headers = new HttpHeaders({
      // 'X-Skip-Interceptor': ''
    });

    if (options.skipInterceptor) {
      headers = headers.append('X-Skip-Interceptor', '');
    }

    return this.http.get(unauthorized_resource.url, {
      headers
    });
  }

  calltorefreshtoken() {
    const headers = new HttpHeaders({
      'X-Skip-Interceptor': ''
    });

    return this.http.get(refreshtoken_resource.url, {
      headers
    });
  }

  header(key, value, headers: HttpHeaders = new HttpHeaders()) {
    return headers.append(key, value);
  }

}
