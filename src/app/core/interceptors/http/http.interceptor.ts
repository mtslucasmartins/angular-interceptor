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

import { Observable, EMPTY, throwError, of, Subject, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { MocksService, refreshtoken_resource } from '@app/http/mocks.service';


export const HttpStatus = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403
}

@Injectable()
export class GlobalHttpInterceptor implements HttpInterceptor {



  private refreshTokenEmProgresso = false;

  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  constructor(private mocks: MocksService) {
  }


  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const groupId: string = this.id();

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {

        if (request.headers.has('X-Skip-Interceptor')) {
          return throwError(error);
        }

        if (error.error instanceof Error) {
        } else {
          if (error.status === HttpStatus.UNAUTHORIZED) {

            if (this.requestMatchesRefreshTokenURL(request)) {
              this.logout();
              return throwError(error);
            }

            if (this.requestMatchesCallbackURL(request)) {
              this.logout();
              return throwError(error);
            }

            if (this.refreshTokenEmProgresso) {
              this.log('Waiting Refresh...', request, error, groupId);
              return this.refreshTokenSubject
                .pipe(
                  filter(result => result !== null), take(1),
                  switchMap(() => next.handle(this.addAuthenticationToken(request)))
                )
            } else {
              this.refreshTokenEmProgresso = true;

              this.refreshTokenSubject.next(null);
              return this.mocks.calltorefreshtoken().pipe(
                switchMap((token: any) => {
                  this.refreshTokenEmProgresso = false;

                  this.refreshTokenSubject.next(token);

                  // Calls to APIs should have skipInterceptor, to avoid infinite loops
                  this.mocks.calltounauthorized({ skipInterceptor: true }).subscribe(() => {
                    console.log('Call 1');
                  }, (error) =>
                    console.log('Call 2')
                  );

                  return next.handle(this.addAuthenticationToken(request));
                }),
                catchError((err: any) => {
                  this.refreshTokenEmProgresso = false;

                  this.logout();
                  return throwError(error);
                })
              )
            }

            // return throwError(error);
          }
        }
        return EMPTY;
      })
    );
  }



  log(message: string, request: HttpRequest<any>, error: HttpErrorResponse, groupId = null) {
    const cn = GlobalHttpInterceptor.name;
    const ts = new Date().toISOString();
    const status = error.status;
    const url = request.url;

    if (groupId) {
      console.log(`${groupId} [${cn}] [${ts}] [${status} - ${url}]: ${message}`);
    } else {
      console.log(`[${cn}] [${ts}] [${status} - ${url}]: ${message}`);
    }

  }


  addAuthenticationToken(request) {
    const accessToken = ""; //AuthSession.fromLocalStorage().getAuthenticated().accessToken;

    return request.clone({
      setHeaders: {
        'Authorization': `Bearer ${accessToken}`,
        'X-Skip-Interceptor': ''
      }
    });
  }

  private requestMatchesRefreshTokenURL(request: HttpRequest<any>): boolean {
    return request.url.includes("refresh=true");
  }

  private requestMatchesCallbackURL(request: HttpRequest<any>): boolean {
    return request.url.includes('refresh=true');
  }

  private logout() {
    alert("logout");
    // this.authenticationService.authorize();
  }

  private id() {
    let state = '';
    const possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 16; i++) {
      state += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return state;
  }

}