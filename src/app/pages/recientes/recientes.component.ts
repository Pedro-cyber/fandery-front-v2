import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-recientes',
  templateUrl: './recientes.component.html',
  styleUrls: ['./recientes.component.scss']
})
export class RecientesComponent implements OnInit {

  recentDeals: any[] = [];
  productosPaginados: any[] = [];

  currentPage: number = 1;
  pageSize: number = 24;
  totalPages: number = 0;

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
    this.titleService.setTitle('Mejores Ofertas LEGO con Descuento | Fandery');
    this.metaService.updateTag({
      name: 'description',
      content: 'Descubre las mejores ofertas LEGO con descuentos exclusivos. Compara precios y ahorra en tus sets favoritos en Fandery.'
    });

    this.route.queryParams.subscribe(params => {
      const pageParam = +params['page'];
      const sortParam = params['sort'];

      this.currentPage = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
      this.sortOrder = sortParam || 'discountDesc';

      if (!this.dataCargada) {
        this.api.getRecentDeals().subscribe(deals => {
          this.recentDeals = deals;
          this.dataCargada = true;
          this.applySorting();
          this.totalPages = Math.ceil(this.recentDeals.length / this.pageSize);

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

  private applySorting() {
    switch (this.sortOrder) {
      case 'priceAsc':
        this.recentDeals.sort((a, b) => a.mejorPrecio - b.mejorPrecio);
        break;
      case 'priceDesc':
        this.recentDeals.sort((a, b) => b.mejorPrecio - a.mejorPrecio);
        break;
      case 'discountAsc':
        this.recentDeals.sort((a, b) => (a.descuento || 0) - (b.descuento || 0));
        break;
      case 'discountDesc':
        this.recentDeals.sort((a, b) => (b.descuento || 0) - (a.descuento || 0));
        break;
    }
  }

  updatePagination() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.productosPaginados = this.recentDeals.slice(start, end);
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

