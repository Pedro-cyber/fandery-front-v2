import { Component, Input } from '@angular/core';
import { Product } from '../../models/product.model';
import { AnalyticsService } from '../../services/analytics.service';



@Component({
  selector: 'app-product-detail-prices',
  templateUrl: './product-detail-prices.component.html',
  styleUrls: ['./product-detail-prices.component.scss']
})
export class ProductDetailPricesComponent  {

  constructor(private analytics: AnalyticsService) {}

  @Input() product!: Product;

  storeLogos: Record<string, string> = {
    toysrus: 'assets/images/stores/toysrus_logo.png',
    miravia: 'assets/images/stores/miravia_logo.webp',
    amazon: 'assets/images/stores/amazon_logo.jpg',
    brickoutique: 'assets/images/stores/brickoutique_logo.png',
    lego: 'assets/images/stores/lego_logo.webp',
    Fnac: 'assets/images/stores/fnac_logo.webp',
    Carrefour: 'assets/images/stores/carrefour_logo.webp',
    'El Corte Ingles ES':  'assets/images/stores/eci_logo.jpg',
    'Abacus ES':  'assets/images/stores/abacus_logo.png'
  };

  isMinHistoric(): boolean {
     var mejorPrecio = this.product?.precios?.[0]?.price;
    if (!this.product || mejorPrecio === undefined || this.product.minHistoricalPrice === undefined || this.product.price === undefined) return false;
    return mejorPrecio <= this.product.minHistoricalPrice && mejorPrecio < this.product.price ;
  }

  isPriceMinHistoric(precio: any): boolean {
    if (!precio  || this.product.minHistoricalPrice === undefined || this.product.price === undefined) return false;
    return precio <= this.product.minHistoricalPrice && precio < this.product.price ;

  }

  hasCoupon(precio: any): boolean {
    const couponTypes = ['Flash', 'Plus', 'Amazoncoupon'];
    if (!precio || precio.couponTypeApplied === undefined ) return false;
      return  couponTypes.includes(precio.couponTypeApplied)
  }

  trackStoreClick(event: MouseEvent, precio: any) {
    this.analytics.trackEvent('click_tienda', {
      tienda: precio.store,
      precio: precio.price,
      descuento: precio.descuento,
      lego_id: this.product.legoId,
      lego_nombre: this.product.name_es || this.product.name
    });

  }
}
