import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { catchError, concatAll, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { PlanqkPlatformLoginService } from '../services/planqk-platform-login.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private planqkPlatformLoginService: PlanqkPlatformLoginService) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (req.url.toString().includes('qc-catalog')) {
      return this.planqkPlatformLoginService
        .getBearerToken()
        .pipe(
          map((bearerToken: string) =>
            next.handle(this.addBearerToken(req, bearerToken)).pipe(
              catchError((err) => {
                this.planqkPlatformLoginService.logoutFromPlanqkPlatform();
                return throwError('Request to PlanQK Platform failed!', err);
              })
            )
          )
        )
        .pipe(concatAll());
    }
    return next.handle(req);
  }

  addBearerToken(
    request: HttpRequest<unknown>,
    bearerToken: string
  ): HttpRequest<unknown> {
    if (bearerToken) {
      return request.clone({
        setHeaders: { Authorization: 'Bearer ' + bearerToken },
      });
    }
    return request;
  }
}
