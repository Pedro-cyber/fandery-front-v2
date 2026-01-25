import { Component, Input, OnDestroy } from '@angular/core';
import { Modal } from 'bootstrap';
import { ApiService } from '../../services/api.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-price-alert',
  templateUrl: './price-alert.component.html',
  styleUrls: ['./price-alert.component.scss']
})
export class PriceAlertComponent implements OnDestroy {

  @Input() product!: Product;
  @Input() modalId!: string;

  alertType: 'price' | 'discount' = 'price';
  alertMinPrice!: number;
  alertDiscount!: number;

  alertEmail = '';
  consentAccepted = false;

  loading = false;
  success = false;
  errorMessage = '';

  private modal!: Modal;

  constructor(private apiService: ApiService) {}

  /* ----------------------------- */
  /* Helpers                       */
  /* ----------------------------- */

  get currentPrice(): number | null {
    if (!this.product?.precios?.length) return null;
    return Math.min(...this.product.precios.map(p => p.price));
  }

  get priceOriginal(): number | null {
    if (!this.product) return null;
    return this.product.price ?? null;
  }

  get currentDiscount(): number | null {
  const original = this.priceOriginal;
  const current = this.currentPrice;

  if (original === null || current === null || original <= current) {
    return null;
  }

  return Math.round(((original - current) / original) * 100);
}


  /* ----------------------------- */
  /* Modal                         */
  /* ----------------------------- */

  openModal() {
    const el = document.getElementById(this.modalId);
    if (!el) return;

    this.resetState();
    this.modal = new Modal(el);
    this.modal.show();
  }

  /* ----------------------------- */
  /* Submit                        */
  /* ----------------------------- */

  submit() {
    this.errorMessage = '';

    if (!this.consentAccepted) {
      this.errorMessage = 'Debes aceptar el consentimiento para continuar.';
      return;
    }

    if (!this.alertEmail) {
      this.errorMessage = 'Introduce un email válido.';
      return;
    }

    const currentPrice = this.currentPrice;

    if (!currentPrice) {
      this.errorMessage = 'No se pudo obtener el precio actual del producto.';
      return;
    }

    let targetPrice: number;

    if (this.alertType === 'price') {
      if (!this.alertMinPrice) {
        this.errorMessage = 'Introduce un precio válido.';
        return;
      }

      targetPrice = this.alertMinPrice;
    } else {
      if (!this.alertDiscount || this.alertDiscount <= 0 || this.alertDiscount >= 100) {
        this.errorMessage = 'Introduce un descuento válido.';
        return;
      }

      const originalPrice = this.priceOriginal;

      if (originalPrice === null) {
        this.errorMessage = 'No se puede crear una alerta sin precio original.';
        return;
      }

      targetPrice = Number(
        (originalPrice * (1 - this.alertDiscount / 100)).toFixed(2)
      );
    }

    if (targetPrice >= currentPrice) {
      this.errorMessage =
        `El precio objetivo (${targetPrice} €) debe ser inferior al precio actual (${currentPrice} €).`;
      return;
    }

    this.loading = true;

    const payload = {
      legoId: this.product.legoId,
      productName: this.product.name_es || this.product.name,
      productImage: this.product.image,
      productUrl: window.location.href,
      email: this.alertEmail,
      minPrice: targetPrice

    };

    this.apiService.createPriceAlert(payload).subscribe({
      next: () => {
        this.loading = false;
        this.success = true;

        setTimeout(() => {
          this.modal.hide();
        }, 1200);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage =
          err.status === 409
            ? 'Ya existe una alerta para este producto y email.'
            : 'No se pudo crear la alerta. Inténtalo más tarde.';
      }
    });
  }

  /* ----------------------------- */
  /* Utils                         */
  /* ----------------------------- */

  resetState() {
    this.success = false;
    this.errorMessage = '';
    this.loading = false;
  }

  ngOnDestroy() {
    this.modal?.dispose();
  }
}
