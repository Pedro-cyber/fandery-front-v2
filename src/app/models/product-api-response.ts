import { Product, StorePrice } from './product.model';

export interface ProductApiResponse {
  set: Product;
  precios: StorePrice[];
}
