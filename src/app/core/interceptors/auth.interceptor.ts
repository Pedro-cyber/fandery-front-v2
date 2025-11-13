import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from './../../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();

    const authReq = token ? req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    }) : req;

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        // Solo actuamos en 401 (no autorizado)
        if (error.status === 401) {
          console.warn('🔄 Token caducado, renovando...');
          return this.authService.login().pipe(
            switchMap((res) => {
              // ✅ Guardar nuevo token antes de reintentar
              this.authService.saveToken(res.token);

              // ✅ Clonar request original con el nuevo token
              const newReq = req.clone({
                setHeaders: { Authorization: `Bearer ${res.token}` }
              });

              return next.handle(newReq);
            }),
            catchError(err => {
              console.error('❌ Error renovando token', err);
              return throwError(() => err);
            })
          );
        }
        return throwError(() => error);
      })
    );
  }
}
