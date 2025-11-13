import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'token';

  constructor(private http: HttpClient) {}

  /** Guarda token en sessionStorage */
  saveToken(token: string) {
    sessionStorage.setItem(this.tokenKey, token);
  }

  /** Obtiene token actual */
  getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

  /** Elimina token */
  clearToken() {
    sessionStorage.removeItem(this.tokenKey);
  }

  /** ✅ Decodifica el JWT para saber si está caducado */
  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000); // en segundos
      return payload.exp < now;
    } catch (e) {
      console.warn('⚠️ Token inválido o malformado');
      return true;
    }
  }

  /** ✅ Llama al login en el backend para obtener nuevo JWT */
  login(): Observable<{ token: string }> {
    return new Observable(observer => {
      this.http.post<{ token: string }>(`${environment.apiUrl}/auth/login`, {
        username: environment.apiUser,
        password: environment.apiPass
      }).subscribe({
        next: (res) => {
          this.saveToken(res.token);
          //console.log('✅ Nuevo token guardado');
          observer.next(res);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

  /**
   * ✅ AutoLogin:
   * - Si hay token válido → resuelve inmediatamente
   * - Si no hay token o está caducado → hace login y resuelve
   */
  autoLogin(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const token = this.getToken();

      if (token && !this.isTokenExpired(token)) {
        //console.log('✅ Token válido, no se necesita login');
        resolve(true);  // <-- devuelve true si hay token válido
      } else {
        //console.log('🔄 Token ausente o caducado, obteniendo nuevo...');
        this.http.post<{ token: string }>(`${environment.apiUrl}/auth/login`, {
          username: environment.apiUser,
          password: environment.apiPass
        }).subscribe({
          next: (res) => {
            this.saveToken(res.token);
            //console.log('✅ AutoLogin completado');
            resolve(true);  // <-- devuelve true tras login
          },
          error: (err) => {
            console.error('❌ Error en autoLogin()', err);
            resolve(false); // <-- devuelve false si error (o reject si prefieres)
          }
        });
      }
    });
  }
}
