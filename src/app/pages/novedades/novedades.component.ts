import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Title, Meta } from '@angular/platform-browser';
import { Location } from '@angular/common';

@Component({
  selector: 'app-novedades',
  templateUrl: './novedades.component.html',
  styleUrls: ['./novedades.component.scss']
})
export class NovedadesComponent implements OnInit {

  newProducts: any[] = [];
  productosFiltrados: any[] = [];
  productosPaginados: any[] = [];

  currentPage: number = 1;
  pageSize: number = 24;
  totalPages: number = 0;

  filter: 'all' | 'offers' = 'all';
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
    const title = 'Novedades LEGO: últimos lanzamientos al mejor precio | Fandery';
    const description =  'Descubre los nuevos sets de LEGO y compara precios entre tiendas (Amazon, LEGO.com, ECI, Fnac, ToysRus..). Consigue el mejor precio en Fandery.'
    this.titleService.setTitle(title);
    this.metaService.updateTag({
      name: 'description',
      content: description
    });

    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({ property: 'og:description', content: description });

    this.route.queryParams.subscribe(params => {
      const pageParam = +params['page'];
      const filterParam = params['filter'];
      const sortParam = params['sort'];

      this.currentPage = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
      this.filter = filterParam === 'offers' ? 'offers' : 'all';
      this.sortOrder = sortParam || 'discountDesc';

      if (!this.dataCargada) {
        this.api.getNewProducts().subscribe(products => {
          this.newProducts = products;
          this.dataCargada = true;
          this.applyFilterAndPagination();

          if (this.currentPage > this.totalPages) {
            this.currentPage = 1;
            this.updatePagination();
            this.updateUrl();
          }
        });
      } else {
        this.applyFilterAndPagination();
      }
    });
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
      this.currentPage = 1;
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

  applyFilterAndPagination() {
    if (this.filter === 'offers') {
      this.productosFiltrados = this.newProducts.filter(p => p.descuento && p.descuento > 0);
    } else {
      this.productosFiltrados = [...this.newProducts];
    }

    this.applySorting();

    this.totalPages = Math.ceil(this.productosFiltrados.length / this.pageSize);
    this.updatePagination();
  }

  updatePagination() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.productosPaginados = this.productosFiltrados.slice(start, end);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.updatePagination();
    this.updateUrl();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private updateUrl() {
    const queryParams: any = {
      page: this.currentPage,
      filter: this.filter === 'all' ? null : this.filter,
      sort: this.sortOrder === 'discountDesc' ? null : this.sortOrder
    };

    const urlTree = this.router.createUrlTree([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge'
    });

    this.location.replaceState(urlTree.toString());
  }
}
