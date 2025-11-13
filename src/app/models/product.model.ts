export interface Product {
  legoId: string;
  name: string;
  name_es: string;
  description_es: string;
  theme: string;
  image: string;
  image_thumbnail?: string;
  thumbnail?: string;

  mejorPrecio?: number;
  priceOriginal?: number;
  price?: number;
  descuento?: number;
  couponTypeApplied?: string;

  minHistoricalPrice?: number;
  maxHistoricalPrice?: number;

  bricksetURL?: string;
  pieces?: number;
  precios?: StorePrice[];
}

export interface StorePrice {
  price: number;
  date: string;
  url: string;
  store: string;
  descuento: number;
  couponTypeApplied: string;
}
