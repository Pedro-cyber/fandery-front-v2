import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Location } from '@angular/common';
import { Title, Meta, TransferState, makeStateKey } from '@angular/platform-browser';
import { SpintaxService } from '../../services/spintax.service';

// Claves para TransferState
const PRODUCTS_LIST_KEY = makeStateKey<any[]>('productsListData');
const THEMES_KEY = makeStateKey<any[]>('themesListData');

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
    private spintax: SpintaxService,
    private transferState: TransferState // ✅ Inyectado
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const themeParam = params.get('theme');
      var newTheme = themeParam ? this.deslugify(themeParam) : '';
      if (newTheme == 'Pokemon') {
        newTheme = 'Pokémon';
      }

      this.route.queryParams.subscribe(queryParams => {
        const newQuery = queryParams['q'] || '';
        const pageParam = +queryParams['page'];
        const filterParam = queryParams['filter'];
        const sortParam = queryParams['sort'];

        if (this.theme !== newTheme || this.query !== newQuery) {
          this.transferState.remove(PRODUCTS_LIST_KEY);
          this.productos = [];
        }

        this.theme = newTheme;
        this.query = newQuery;
        this.currentPage = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
        this.filter = filterParam === 'offers' ? 'offers' : 'all';
        this.sortOrder = sortParam || 'discountDesc';

        // --- LÓGICA DE HIDRATACIÓN ---
        const savedProducts = this.transferState.get(PRODUCTS_LIST_KEY, null);

        if (savedProducts && savedProducts.length > 0) {
          this.productos = savedProducts;
          this.applyFilterAndPagination();
          this.updateMetaLogic();
        } else {
          this.loadData();
        }

        const savedThemes = this.transferState.get(THEMES_KEY, null);
        if (savedThemes) {
          this.themes = savedThemes;
        } else {
          this.api.getThemes().subscribe(themes => {
            this.themes = themes;
            this.transferState.set(THEMES_KEY, themes);
          });
        }
      });
    });
  }

  private loadData() {
    if (this.theme) {
      this.getByTheme();
    } else if (this.query) {
      this.getByQuery();
    }
  }

  private updateMetaLogic() {
    if (this.theme) {
      this.updateMetaForTheme();
    } else if (this.query) {
      this.resetMetaTags(`Resultados para "${this.query}"`);
    }
  }

  getByQuery() {
    this.api.searchProducts(this.query).subscribe(result => {
      this.productos = result;
      this.transferState.set(PRODUCTS_LIST_KEY, result); // Guardar para Scully
      this.applyFilterAndPagination();
      this.resetMetaTags(`Resultados para "${this.query}"`);
    });
  }

  getByTheme() {
    this.api.searchByTheme(this.theme).subscribe(result => {
      this.productos = result;
      this.transferState.set(PRODUCTS_LIST_KEY, result); // Guardar para Scully
      this.applyFilterAndPagination();
      this.updateMetaForTheme();
    });
  }

  private updateMetaForTheme() {
    if (!this.theme) return;

    const variables = { category: this.theme };
    const titleTemplate = 'Ofertas LEGO {{category}} – {Compara precios y tiendas|Encuentra tu mejor opción} | Fandery';
    const descriptionTemplate = '{Ofertas|Sets de} LEGO {{category}} – {Compara precios y ahorra|Precios actualizados}.';

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

    if (this.theme) {
      this.router.navigate(['/product-list/theme', this.theme], { queryParams });
    } else {
      this.router.navigate(['/product-list'], { queryParams });
    }
  }

  private deslugify(slug: string): string {
    const specialCases: {[key: string]: string} = {
      'dc-comics-super-heroes': 'DC Comics Super Heroes',
      'sonic-the-hedgehog': 'Sonic the Hedgehog',
      'gabby-s-dollhouse': "Gabby's Dollhouse",
      'brickheadz': 'BrickHeadz'
    };

    if (specialCases[slug]) return specialCases[slug];

    return slug
      .replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }
}
