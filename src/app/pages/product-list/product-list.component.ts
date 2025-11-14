import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Location } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { SpintaxService } from '../../services/spintax.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  productos: any[] = [];
  productosFiltrados: any[] = [];
  productosPaginados: any[] = [];

  query: string = '';
  theme: string = '';
  themes: any[] = [];

  currentPage: number = 1;
  pageSize: number = 24;
  totalPages: number = 0;

  filter: 'all' | 'offers' = 'all';
  sortOrder: 'priceAsc' | 'priceDesc' | 'discountAsc' | 'discountDesc' = 'discountDesc';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private location: Location,
    private titleService: Title,
    private metaService: Meta,
    private spintax: SpintaxService
  ) {}

  ngOnInit(): void {
    // Suscribirse tanto a los parámetros de ruta como a los queryParams
    this.route.paramMap.subscribe(params => {
      const themeParam = params.get('theme') ;

      if (themeParam) {
        this.theme = this.deslugify(themeParam);
      }

      this.route.queryParams.subscribe(queryParams => {
        this.query = queryParams['q'] || '';
        const pageParam = +queryParams['page'];
        const filterParam = queryParams['filter'];
        const sortParam = queryParams['sort'];

        this.currentPage = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
        this.filter = filterParam === 'offers' ? 'offers' : 'all';
        this.sortOrder = sortParam || 'discountDesc';

        // Cargar productos según la ruta activa
        if (this.theme) {
          this.getByTheme();
        } else if (this.query) {
          this.getByQuery();
        } else {
          this.productos = [];
          this.productosFiltrados = [];
          this.productosPaginados = [];
        }

        // Cargar lista de themes (solo una vez)
        if (!this.themes.length) {
          this.api.getThemes().subscribe(themes => (this.themes = themes));
        }
      });
    });
  }

  getByQuery() {
    this.api.searchProducts(this.query).subscribe(result => {
      this.productos = result;
      this.applyFilterAndPagination();
      this.resetMetaTags(`Resultados para "${this.query}"`);
    });
  }

  getByTheme() {
    this.api.searchByTheme(this.theme).subscribe(result => {
      this.productos = result;
      this.applyFilterAndPagination();
      this.updateMetaForTheme();
    });
  }

  private updateMetaForTheme() {
    if (!this.theme) return;

    const variables = { category: this.theme };

    const titleTemplate =
      'Ofertas LEGO {{category}} – {Compara precios y tiendas|Compara precios y encuentra tu mejor opción|Descubre las mejores tiendas|Ofertas y precios actualizados|Encuentra los mejores precios} | Fandery';

    const descriptionTemplate =
      '{Ofertas|Promociones|Descuentos|Precios de|Sets de} LEGO {{category}} – {Compara precios y tiendas|Compara precios y encuentra tu mejor opción|Descubre las mejores tiendas|Ofertas y precios actualizados|Encuentra los mejores precios} | Fandery';

    const metaTitle = this.spintax.generate(titleTemplate, variables, this.theme);
    const metaDescription = this.spintax.generate(descriptionTemplate, variables, this.theme);

    this.titleService.setTitle(metaTitle);
    this.metaService.updateTag({ name: 'description', content: metaDescription });
    this.metaService.updateTag({ property: 'og:title', content: metaTitle });
    this.metaService.updateTag({ property: 'og:description', content: metaDescription });
  }

  private resetMetaTags(title: string) {
    this.titleService.setTitle(`${title} | Fandery`);
    this.metaService.updateTag({ name: 'description', content: `${title} – Compara precios de sets LEGO` });
  }

  setFilter(filter: 'all' | 'offers') {
    if (this.filter !== filter) {
      this.filter = filter;
      this.currentPage = 1;
      this.applyFilterAndPagination();
      this.updateUrl();
    }
  }

  setSortOrder(order: 'priceAsc' | 'priceDesc' | 'discountAsc' | 'discountDesc') {
    if (this.sortOrder !== order) {
      this.sortOrder = order;
      this.applyFilterAndPagination();
      this.updateUrl();
    }
  }

  private applySorting() {
    switch (this.sortOrder) {
      case 'priceAsc':
        this.productosFiltrados.sort((a, b) => a.mejorPrecio - b.mejorPrecio);
        break;
      case 'priceDesc':
        this.productosFiltrados.sort((a, b) => b.mejorPrecio - a.mejorPrecio);
        break;
      case 'discountAsc':
        this.productosFiltrados.sort((a, b) => (a.descuento || 0) - (b.descuento || 0));
        break;
      case 'discountDesc':
        this.productosFiltrados.sort((a, b) => (b.descuento || 0) - (a.descuento || 0));
        break;
    }
  }

  updatePagination() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.productosPaginados = this.productosFiltrados.slice(start, end);
  }

  applyFilterAndPagination() {
    this.productosFiltrados =
      this.filter === 'offers'
        ? this.productos.filter(p => p.descuento && p.descuento > 0)
        : [...this.productos];

    this.applySorting();
    this.totalPages = Math.ceil(this.productosFiltrados.length / this.pageSize);
    this.updatePagination();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.updatePagination();
    this.updateUrl();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private updateUrl() {
    const queryParams: any = {};
    if (this.query) queryParams.q = this.query;
    queryParams.page = this.currentPage;
    queryParams.filter = this.filter === 'all' ? null : this.filter;
    queryParams.sort = this.sortOrder === 'discountDesc' ? null : this.sortOrder;

    // 🔹 Si hay theme, navegamos a /product-list/theme/:theme
    if (this.theme) {
      this.router.navigate(['/product-list/theme', this.theme], { queryParams });
    } else {
      this.router.navigate(['/product-list'], { queryParams });
    }
  }

  private deslugify(slug: string): string {
    return slug
      .replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }
}
