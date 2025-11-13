import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

declare let gtag: Function; // usamos la función global de GA4

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  constructor(private router: Router) {}

  init() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        gtag('config', 'G-9RZPPFR1BN', {
          page_path: event.urlAfterRedirects
        });
      });
  }

  trackEvent(eventName: string, params: any = {}) {
    if (typeof gtag === 'function') {
      gtag('event', eventName, params);
      //console.log('📊 Evento GA4 enviado:', eventName, params);
    } else {
      //console.warn('⚠️ gtag no está disponible todavía');
    }
  }
}
