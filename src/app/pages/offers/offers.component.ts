import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss']
})
export class OffersComponent implements OnInit {

  bestDeals: any[] = [];
  productosPaginados: any[] = [];

  currentPage: number = 1;
  pageSize: number = 24;
  totalPages: number = 0;

  themes: any[] = [];
  selectedTheme: string = '';
  filteredDeals: any[] = [];

  sortOrder: 'priceAsc' | 'priceDesc' | 'discountAsc' | 'discountDesc' = 'discountDesc';

  private dataCargada = false;

  constructor(
    private api: ApiService,
    private titleService: Title,
    private metaService: Meta,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit() {
    const title = 'Ofertas LEGO 2025 | Descuentos y chollos actualizados en tiempo real | Fandery';
    const description =  'Descubre las mejores ofertas LEGO 2025. Compara precios entre Amazon, LEGO.com, Fnac, ECI y más. Encuentra descuentos reales y chollos actualizados en tiempo real con Fandery.';
    this.titleService.setTitle(title);
    this.metaService.updateTag({
      name: 'description',
      content: description
    });
    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({ property: 'og:description', content: description });

    this.route.queryParams.subscribe(params => {
      const pageParam = +params['page'];
      const sortParam = params['sort'];
      const themeParam = params['theme'];
      this.selectedTheme = themeParam || '';

      this.currentPage = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
      this.sortOrder = sortParam || 'discountDesc';

      if (!this.dataCargada) {
        this.api.getBestDeals().subscribe(deals => {
          this.bestDeals = deals;
          this.generateThemes();
          this.dataCargada = true;
          this.applySorting();
          this.totalPages = Math.ceil(this.bestDeals.length / this.pageSize);

          if (this.currentPage > this.totalPages) {
            this.currentPage = 1;
            this.updateUrl();
          }
          this.updatePagination();
        });
      } else {
        this.applySorting();
        this.updatePagination();
      }
    });
  }

  setSortOrder(order: 'priceAsc' | 'priceDesc' | 'discountAsc' | 'discountDesc') {
    if (this.sortOrder !== order) {
      this.sortOrder = order;
      this.currentPage = 1;
      this.applySorting();
      this.updatePagination();
      this.updateUrl();
    }
  }

  private generateThemes() {
    this.themes = [...new Set(
      this.bestDeals
        .filter(d => d.theme)
        .map(d => d.theme)
    )].sort();
  }

  private applySorting() {

     this.filteredDeals = [...this.bestDeals];

    // 1️⃣ Filtro por theme
    if (this.selectedTheme) {
      this.filteredDeals = this.filteredDeals.filter(d => d.theme === this.selectedTheme);
    }

    switch (this.sortOrder) {
      case 'priceAsc':
        this.filteredDeals.sort((a, b) => a.mejorPrecio - b.mejorPrecio);
        break;
      case 'priceDesc':
        this.filteredDeals.sort((a, b) => b.mejorPrecio - a.mejorPrecio);
        break;
      case 'discountAsc':
        this.filteredDeals.sort((a, b) => (a.descuento || 0) - (b.descuento || 0));
        break;
      case 'discountDesc':
        this.filteredDeals.sort((a, b) => (b.descuento || 0) - (a.descuento || 0));
        break;
    }
  }

  updatePagination() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.productosPaginados = this.filteredDeals.slice(start, end);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.updatePagination();
    this.updateUrl();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onThemeChange() {
    this.currentPage = 1;
    this.applySorting();
    this.updatePagination();
    this.updateUrl();
  }

  private updateUrl() {
    const queryParams: any = {
      page: this.currentPage,
      sort: this.sortOrder === 'discountDesc' ? null : this.sortOrder,
      theme: this.selectedTheme || null
    };

    const urlTree = this.router.createUrlTree([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge'
    });

    this.location.replaceState(urlTree.toString());
  }
}
