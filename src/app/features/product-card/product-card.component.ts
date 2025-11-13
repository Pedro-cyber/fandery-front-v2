import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../models/product.model';
import { AnalyticsService } from '../../services/analytics.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
  @Input() product!: Product;

  constructor(private router: Router, private analytics: AnalyticsService) {}

  hasDiscount(product: Product | undefined): boolean {
    if (!product || product.mejorPrecio === undefined || product.priceOriginal === undefined) {
      return false;
    }
    return product.mejorPrecio < product.priceOriginal;
  }

  isMinHistoric(product: Product | undefined): boolean {
    if (!product || product.mejorPrecio === undefined || product.minHistoricalPrice === undefined || product.priceOriginal === undefined) return false;
    return product.mejorPrecio <= product.minHistoricalPrice && product.mejorPrecio < product.priceOriginal ;
  }

  hasCoupon(product: Product | undefined): boolean  {
    const couponTypes = ['Flash', 'Plus', 'Amazoncoupon'];
    if (!product || product.couponTypeApplied === undefined ) return false;
      return  couponTypes.includes(product.couponTypeApplied)
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

  goToDetail() {
    if (!this.product) return;

    this.analytics.trackEvent('click_producto', {
      lego_id: this.product.legoId,
      nombre: this.product.name_es ||this.product.name ,
      precio: this.product.mejorPrecio ?? this.product.priceOriginal,
      descuento: this.product.descuento ?? 0
    });

    const slug = this.slugify(this.product.name_es || this.product.name, this.product.legoId);
    this.router.navigate(['/sets', slug]);
  }
}
