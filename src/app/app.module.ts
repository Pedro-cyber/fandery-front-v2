import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { ScullyLibModule } from '@scullyio/ng-lib';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './core/header/header.component';
import { FooterComponent } from './core/footer/footer.component';
import { SearchBarComponent } from './features/search-bar/search-bar.component';
import { CategorySelectorComponent } from './features/category-selector/category-selector.component';
import { ProductCardComponent } from './features/product-card/product-card.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { BestDealsComponent } from './features/best-deals/best-deals.component';
import { PromoListComponent } from './features/promo-list/promo-list.component';
import { HomeComponent } from './pages/home/home.component';
import { ProductListComponent } from './pages/product-list/product-list.component';
import { LoaderInterceptor } from './core/interceptors/loader.interceptor';
import { SpinnerComponent } from './core/spinner/spinner.component';
import { PromoCardComponent } from './features/promo-card/promo-card.component';
import { ProductDetailDescriptionComponent } from './features/product-detail-description/product-detail-description.component';
import { ProductDetailAnalyticsComponent } from './features/product-detail-analytics/product-detail-analytics.component';
import { ProductDetailPricesComponent } from './features/product-detail-prices/product-detail-prices.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { OffersComponent } from './pages/offers/offers.component';
import { CategoriasComponent } from './pages/categorias/categorias.component';
import { PromocionesComponent } from './pages/promociones/promociones.component';
import { PaginatorComponent } from './features/paginator/paginator.component';
import { NovedadesComponent } from './pages/novedades/novedades.component';
import { FilterToggleComponent } from './features/filter-toggle/filter-toggle.component';
import { AffiliateLinkPipe } from './pipes/affliliation-link.pipe';
import { SlugifyPipe } from './pipes/slugify.pipe';

import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { FeaturedProductsComponent } from './features/featured-products/featured-products.component';
import { SortButtonsComponent } from './features/sort-buttons/sort-buttons.component';
import { SwiperModule } from 'swiper/angular';
import { RecientesComponent } from './pages/recientes/recientes.component';
import { ExclusivosComponent } from './pages/exclusivos/exclusivos.component';


registerLocaleData(localeEs, 'es');

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SearchBarComponent,
    CategorySelectorComponent,
    ProductCardComponent,
    ProductDetailComponent,
    BestDealsComponent,
    PromoListComponent,
    HomeComponent,
    ProductListComponent,
    SpinnerComponent,
    PromoCardComponent,
    ProductDetailDescriptionComponent,
    ProductDetailAnalyticsComponent,
    ProductDetailPricesComponent,
    AboutUsComponent,
    OffersComponent,
    CategoriasComponent,
    PromocionesComponent,
    PaginatorComponent,
    NovedadesComponent,
    FilterToggleComponent,
    FeaturedProductsComponent,
    SortButtonsComponent,
    AffiliateLinkPipe,
    SlugifyPipe,
    RecientesComponent,
    ExclusivosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    SwiperModule,
    ScullyLibModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es' },
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
