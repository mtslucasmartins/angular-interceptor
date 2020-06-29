import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HTTP_INTERCEPTORS
} from '@angular/common/http';

import { Observable, EMPTY, throwError, of, Subject } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthSession } from '@shared/models/AuthSession';
import { MocksService, refreshtoken_resource, unauthorized_resource } from '@app/http/mocks.service';
import { resolve } from 'dns';

@Injectable({
  providedIn: 'root'
})
export class HttpErrorInterceptor implements HttpInterceptor {

  private UNAUTHORIZED = 401;

  private _refreshSubject: Subject<any> = new Subject<any>();

  constructor(private mocks: MocksService) { }

  private _ifTokenExpired() {
    this._refreshSubject.subscribe({
      complete: () => {
        this._refreshSubject = new Subject<any>();
      }
    });
    if (this._refreshSubject.observers.length === 1) {
      const authSession = AuthSession.fromLocalStorage();
      this.mocks.calltorefreshtoken().subscribe(this._refreshSubject);
    }
    return this._refreshSubject;
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log("Request Intercepted");
    console.log("URL: " + request.url + "\n\n");

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.error instanceof Error) {
          // A client-side or network error occurred. Handle it accordingly.
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong,
          if (error.status === this.UNAUTHORIZED) {
            if (this.requestMatchesRefreshTokenURL(request)) {
              this.requestAuthorization();
            }

            return this._ifTokenExpired().pipe(
              switchMap((response) => {
                // if (response.access_token) {
                console.log("Refresh Token");

                new Promise<any>(async (resolve, reject) => {
                  resolve();
                }).then(async () => {
                  console.log("call inside interceptor...");
                  this.mocks.calltounauthorized().subscribe();
                });
                // }
                return next.handle(this.updateHeader(request));
              })
            );
          } else {
            if (this.requestMatchesRefreshTokenURL(request)) {
              // this.authenticationService.clearStorage();
              this.requestAuthorization();
            }
            return throwError(error);
          }
        }
        // If you want to return a new response:
        //return of(new HttpResponse({body: [{name: "Default value..."}]}));

        // If you want to return the error on the upper level:
        //return throwError(error);

        // or just return nothing:
        return EMPTY;
      })
    );
  }

  updateHeader(req) {
    const accessToken = AuthSession.fromLocalStorage().getAuthenticated().accessToken;
    req = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${accessToken}`)
    });
    return req;
  }

  private requestMatchesRefreshTokenURL(request: HttpRequest<any>): boolean {
    return request.url.includes(refreshtoken_resource.url);
  }

  private requestAuthorization() {
    window.location.reload();
  }


}

export const ErrorInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: HttpErrorInterceptor,
  multi: true,
};