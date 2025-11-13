import { Component, Inject } from '@angular/core';
import { OnInit } from '@angular/core/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AnalyticsService } from './services/analytics.service';
import { AuthService } from './services/auth.service';
import { SeoService } from './services/seo.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Fandery';

  constructor(
    private router: Router,
    private analytics: AnalyticsService,
    private authService: AuthService,
    private seoService: SeoService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  async ngOnInit() {
    const hasToken = await this.authService.autoLogin();

    if (!hasToken) {
      this.authService.login().subscribe({
        next: () => {},
        error: (err) => {}
      });
    }

    this.analytics.init();

    this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe(() => {
      const baseDomain = 'https://www.fandery.com';
      let currentUrl = `${baseDomain}${this.router.url}`;
      if (this.router.url === '/' || this.router.url === '/home') {
        currentUrl = baseDomain + '/';
      }

      // Canonical y hreflang
      this.seoService.setCanonicalURL(currentUrl);
      this.setHreflangTags('es-ES', currentUrl);

      // Determinar el tipo de página (product o website)
      const ogType = this.router.url.includes('/sets/') ? 'product' : 'website';

      // Metadatos dinámicos base
      const defaultMeta = {
        title: 'Fandery | Tu Plataforma para Encontrar Ofertas LEGO y Comparar Precios',
        description: 'Fandery reúne las mejores ofertas de LEGO en un solo lugar. Descubre descuentos exclusivos y compara precios de sets en tiendas oficiales y especializadas.',
        image: 'https://www.fandery.com/assets/logo2.png',
        url: currentUrl,
        type: ogType
      };

      this.seoService.updateMetaTags(defaultMeta);

      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  private setHreflangTags(lang: string, baseUrl: string): void {
    // Eliminar hreflangs previos si existen
    const existingLinks = this.document.querySelectorAll('link[rel="alternate"][hreflang]');
    existingLinks.forEach(link => link.remove());

    // Crear etiqueta principal (es-ES)
    const linkEl = this.document.createElement('link');
    linkEl.setAttribute('rel', 'alternate');
    linkEl.setAttribute('hreflang', lang);
    linkEl.setAttribute('href', baseUrl);
    this.document.head.appendChild(linkEl);

    // Crear etiqueta x-default
    const defaultEl = this.document.createElement('link');
    defaultEl.setAttribute('rel', 'alternate');
    defaultEl.setAttribute('hreflang', 'x-default');
    defaultEl.setAttribute('href', baseUrl);
    this.document.head.appendChild(defaultEl);
  }
}
