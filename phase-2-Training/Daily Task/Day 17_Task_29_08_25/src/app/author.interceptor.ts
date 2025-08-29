import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthorInterceptor implements HttpInterceptor {

  constructor() {}

intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
  const token_stored = localStorage.getItem('token');

  if (token_stored) {
    request = request.clone({
      headers: request.headers.set('Authorization', 'Bearer ' + token_stored)
    });
  }

  return next.handle(request);
}

}
