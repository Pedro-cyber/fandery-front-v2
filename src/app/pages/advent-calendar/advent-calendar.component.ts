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


  private async loadAssignedOffers() {
    const savedMapping: Record<number, { id: string; price: number; original: number }> = {
      1: { id: "76435", price: 119.99, original: 199.99 },
      2: { id: "42206", price: 153.98, original: 229.99 },
      3: { id: "75435", price: 96.74, original: 149.99 },
      4: { id: "10338", price: 65.99, original: 89.99 },
      5: { id: "76327", price: 39.99, original: 59.99 },
      6: { id: "60445", price: 50.00, original: 99.99 },
      7: { id: "76280", price: 22.35, original: 39.99 },
      8: { id: "40743", price: 28.04, original: 39.99 },
      9: { id: "76304", price: 63.99, original: 99.99 },
      10: { id: "43269", price: 86.99, original: 139.99 },
      11: { id: "21357", price: 46.66, original: 69.99 },
      12: { id: "43279", price: 46.66, original: 69.99 },
      13: { id: "75639", price: 86.66, original: 129.99 },
      14: { id: "72037", price: 113.33, original: 169.99 },
      15: { id: "75375", price: 56.66, original: 84.99 },
      16: { id: "75379", price: 67.49, original: 99.99 }
    };

    for (const day of this.days) {
      const saved = savedMapping[day.day];
      if (!saved) continue;

      day.productId = saved.id;
      day.savedPrice = saved.price;
      day.savedOriginal = saved.original;
      day.savedDiscount = ((saved.original - saved.price) / saved.original) * 100;

      day.productData = await this.api.getProductById(saved.id).toPromise();

      const found = this.bestDeals.find(d => String(d.legoId) === String(saved.id));

      if (!found) {
        day.expired = true;
        continue;
      }

      const currentPrice = Number(found.mejorPrecio);
      day.expired = currentPrice !== saved.price;
    }
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
