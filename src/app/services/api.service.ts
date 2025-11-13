import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs'
import { tap, map } from 'rxjs/operators';
import { Product } from '../models/product.model';
import { ThemeCount } from '../models/themecount.model';
import { Promo } from '../models/promo.model';
import { HistoricalData } from '../models/historical-data';
import { ProductApiResponse } from '../models/product-api-response';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  private cacheBestDeals: Product[] | null = null;
  private cacheSearch: { [query: string]: Product[] } = {};
  private cacheTheme: { [theme: string]: Product[] } = {};
  private cacheThemesList: ThemeCount[] | null = null;
  private cacheNewProducts: Product[] | null = null;
  private cachePromos: Promo[] | null = null;
  private cacheFeaturedProducts: Product[] | null = null;
  private cacheRecents: Product[] | null = null;
  private cacheHistoricalData:  { [id: string]: HistoricalData[] } = {};


  constructor(private http: HttpClient) {}

  getBestDeals(): Observable<Product[]> {
    if (this.cacheBestDeals) {
      return of(this.cacheBestDeals);
    }
    return this.http.get<Product[]>(`${this.baseUrl}/api/best-deals`).pipe(
      tap(products => this.cacheBestDeals = products)
    );
  }

  getProductById(id: string): Observable<ProductApiResponse> {
    return this.http.get<ProductApiResponse>(`${this.baseUrl}/api/set/${id}`);
  }

  searchProducts(query: string): Observable<Product[]> {
    if (this.cacheSearch[query]) {
      return of(this.cacheSearch[query]);
    }
    return this.http.get<Product[]>(`${this.baseUrl}/api/search/${query}`).pipe(
      tap(products => this.cacheSearch[query] = products)
    );
  }

  searchByTheme(theme: string): Observable<Product[]> {
    if (this.cacheTheme[theme]) {
      return of(this.cacheTheme[theme]);
    }
    return this.http.get<Product[]>(`${this.baseUrl}/api/searchtheme/${theme}`).pipe(
      tap(products => this.cacheTheme[theme] = products)
    );
  }

  getThemes(): Observable<ThemeCount[]> {
    if (this.cacheThemesList) {
      return of(this.cacheThemesList);
    }
    return this.http.get<ThemeCount[]>(`${this.baseUrl}/api/themes`).pipe(
      tap(themes => this.cacheThemesList = themes)
    );
  }

  getPromos(): Observable<Promo[]> {
    if (this.cachePromos) {
      return of(this.cachePromos);
    }
    return this.http.get<Promo[]>(`${this.baseUrl}/api/promos`).pipe(
      tap((promos: Promo[]) => this.cachePromos = promos)
    );
  }

  getNewProducts(): Observable<Product[]> {
    if (this.cacheNewProducts) {
      return of(this.cacheNewProducts);
    }
    return this.http.get<Product[]>(`${this.baseUrl}/api/new-products`).pipe(
      tap(products => this.cacheNewProducts = products)
    );
  }

  getFeaturedProducts(): Observable<Product[]> {
    if (this.cacheFeaturedProducts) {
      return of(this.cacheFeaturedProducts);
    }
    return this.http.get<Product[]>(`${this.baseUrl}/api/featured`).pipe(
      tap(products => this.cacheFeaturedProducts = products)
    );
  }


  getRecentDeals(): Observable<Product[]> {
    if (this.cacheRecents) {
      return of(this.cacheRecents);
    }
    return this.http.get<Product[]>(`${this.baseUrl}/api/recents`).pipe(
      tap(products => this.cacheRecents = products)
    );
  }

  getHistoricalData(id : string): Observable<HistoricalData[]> {
    if (this.cacheHistoricalData[id]) {
      return of(this.cacheHistoricalData[id]);
    }

    return this.http.get<HistoricalData[]>(`${this.baseUrl}/api/historical-data/${id}`).pipe(
      map((historicalData: HistoricalData[]) =>
        historicalData.map(item => ({
          ...item,
          date: new Date(item.date)
        }))
      ),
      tap((historicalData: HistoricalData[]) => this.cacheHistoricalData[id] = historicalData)
    );
  }

}
