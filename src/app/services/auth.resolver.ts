import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthResolver implements Resolve<boolean> {
  constructor(private authService: AuthService) {}

  resolve(): Promise<boolean> {
    // 🔄 Espera a que autoLogin garantice un token válido
    return this.authService.autoLogin();
  }
}
