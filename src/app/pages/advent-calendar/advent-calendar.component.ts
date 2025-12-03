import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { Product } from '../../models/product.model';
import { AnalyticsService } from '../../services/analytics.service';

interface AdventDay {
  day: number;
  productId?: string;
  savedPrice?: number;
  savedOriginal?: number;
  savedDiscount?: number;
  productData?: any;   // Datos actuales de la oferta
  expired?: boolean;   // true si ya no existe o cambió el precio
}

@Component({
  selector: 'app-advent-calendar',
  templateUrl: './advent-calendar.component.html',
  styleUrls: ['./advent-calendar.component.scss']
})
export class AdventCalendarComponent implements OnInit {

  days: AdventDay[] = [];
  bestDeals: any[] = [];

  constructor(private api: ApiService, private router: Router, private analytics: AnalyticsService) {}

  ngOnInit() {
    // Generar días 1–24
    this.days = Array.from({ length: 24 }, (_, i) => ({ day: i + 1 }));

    // Cargar ofertas activas
    this.api.getBestDeals().subscribe(deals => {
      this.bestDeals = deals;
      this.loadAssignedOffers();
    });
  }

  private loadAssignedOffers() {
    const savedMapping: Record<number, { id: string; price: number; original: number }> = {
      1: { id: "76435", price: 119.99, original: 199.99 },
      2: { id: "42206", price: 153.98, original: 229.99 },
      3: { id: "75435", price: 96.74, original: 149.99 }
      // ...
    };

    this.days.forEach(day => {
      const saved = savedMapping[day.day];
      if (!saved) return;

      // Datos guardados
      day.productId = saved.id;
      day.savedPrice = saved.price;
      day.savedOriginal = saved.original;
      day.savedDiscount = ((saved.original - saved.price) / saved.original) * 100;

      // Buscar producto actual
      const found = this.bestDeals.find(d => String(d.legoId) === String(saved.id));

      if (!found) {
        day.expired = true;
        return;
      }

      const currentPrice = Number(found.mejorPrecio);

      if (currentPrice !== saved.price) {
        day.expired = true;
        day.productData = found; // opcional: mostrar la oferta aunque haya cambiado
        return;
      }

      // Oferta válida
      day.productData = found;
      day.expired = false;
    });
  }


  private slugify(name: string, id: string): string {
    return name
      .toLowerCase()
      .normalize("NFD")                  // elimina acentos
      .replace(/[\u0300-\u036f]/g, "")   // elimina tildes
      .replace(/[^a-z0-9]+/g, "-")       // reemplaza espacios y caracteres raros por guiones
      .replace(/^-+|-+$/g, "")           // elimina guiones sobrantes
      + '-' + id;                        // añade ID para evitar duplicados
  }

  goToDetail(product: Product) {
    if (!product) return;

    this.analytics.trackEvent('click_producto', {
      lego_id: product.legoId,
      nombre: product.name_es || product.name ,
      precio: product.mejorPrecio ?? product.priceOriginal,
      descuento: product.descuento ?? 0
    });

    const slug = this.slugify(product.name_es || product.name, product.legoId);
    this.router.navigate(['/sets', slug]);
  }
}
