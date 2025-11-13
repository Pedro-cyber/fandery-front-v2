import { Component, Input } from '@angular/core';
import { Promo } from '../../models/promo.model';


@Component({
  selector: 'app-promo-card',
  templateUrl: './promo-card.component.html',
  styleUrls: ['./promo-card.component.scss']
})
export class PromoCardComponent {

  constructor() { }

  @Input() promo!: Promo;

  getAffiliateUrl(promo: Promo): string {
  if (promo.store === 'Toysrus') {
    const base = 'https://clk.tradedoubler.com/click?p=211811&a=3439161&url=';
    const encodedUrl = encodeURIComponent(promo.url);
    return `${base}${encodedUrl}`;
  }

  if (promo.store === 'Miravia') {
    const awinmid = '37168';
    const awinaffid = '2110303';
    const base = 'https://www.awin1.com/cread.php';
    return `${base}?awinmid=${awinmid}&awinaffid=${awinaffid}&ued=${encodeURIComponent(promo.url)}`;
  }

  if (promo.store === 'El Corte Inglés') {
    const awinmid = '13075';
    const awinaffid = '2158661';
    const base = 'https://www.awin1.com/cread.php';
    return `${base}?awinmid=${awinmid}&awinaffid=${awinaffid}&ued=${encodeURIComponent(promo.url)}`;
  }

  if (promo.store === 'Abacus') {
    const awinmid = '34819';
    const awinaffid = '2158661';
    const base = 'https://www.awin1.com/cread.php';
    return `${base}?awinmid=${awinmid}&awinaffid=${awinaffid}&ued=${encodeURIComponent(promo.url)}`;
  }

  if (promo.store === 'Amazon') {
    const tagAfiliado = 'spanishbricks-21';
    const tieneParametros = promo.url.includes("?");
    const separador = tieneParametros ? "&" : "?";
    return `${promo.url}${separador}tag=${tagAfiliado}`;
  }

  return promo.url;
}

isPromoActive(): boolean {
  if (!this.promo?.expiredDate) return true;
  const today = new Date();
  const expired = new Date(this.promo.expiredDate);
  return expired >= today;
}



}
