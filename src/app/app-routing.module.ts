import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { ProductListComponent } from './pages/product-list/product-list.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { OffersComponent } from './pages/offers/offers.component';
import { CategoriasComponent } from './pages/categorias/categorias.component';
import { PromocionesComponent } from './pages/promociones/promociones.component';
import { NovedadesComponent } from './pages/novedades/novedades.component';
import { RecientesComponent } from './pages/recientes/recientes.component';
import { ExclusivosComponent } from './pages/exclusivos/exclusivos.component';
import { AdventCalendarComponent } from './pages/advent-calendar/advent-calendar.component';
import { AuthResolver } from './services/auth.resolver';

export const routes: Routes = [
  { path: '', component: HomeComponent, resolve: { auth: AuthResolver } },
  { path: 'product-list', component: ProductListComponent, resolve: { auth: AuthResolver } },
  { path: 'product-list/theme/:theme', component: ProductListComponent, resolve: { auth: AuthResolver } },
  { path: 'sets/:slug', component: ProductDetailComponent, resolve: { auth: AuthResolver } },
  { path: 'about-us', component: AboutUsComponent, resolve: { auth: AuthResolver } },
  { path: 'ofertas', component: OffersComponent, resolve: { auth: AuthResolver } },
  { path: 'categorias', component: CategoriasComponent, resolve: { auth: AuthResolver } },
  { path: 'promociones', component: PromocionesComponent, resolve: { auth: AuthResolver } },
  { path: 'novedades', component: NovedadesComponent, resolve: { auth: AuthResolver } },
  { path: 'recientes', component: RecientesComponent, resolve: { auth: AuthResolver } },
  { path: 'exclusivos', component: ExclusivosComponent, resolve: { auth: AuthResolver } },
  //{ path: 'calendario-adviento', component: AdventCalendarComponent, resolve: { auth: AuthResolver } },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
