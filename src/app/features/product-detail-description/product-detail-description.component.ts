import { Component, Input } from '@angular/core';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-detail-description',
  templateUrl: './product-detail-description.component.html',
  styleUrls: ['./product-detail-description.component.scss']
})
export class ProductDetailDescriptionComponent {

  @Input() product!: Product;


}
