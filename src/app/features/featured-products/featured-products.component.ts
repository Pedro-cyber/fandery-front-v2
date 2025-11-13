import { Component, Input } from '@angular/core';
import SwiperCore, { Navigation } from 'swiper';

SwiperCore.use([Navigation]);

@Component({
  selector: 'app-featured-products',
  templateUrl: './featured-products.component.html',
  styleUrls: ['./featured-products.component.scss']
})
export class FeaturedProductsComponent  {

  constructor() { }

  @Input() featuredProducts: any[] = [];



}
