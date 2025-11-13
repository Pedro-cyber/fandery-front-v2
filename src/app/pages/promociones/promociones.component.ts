import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-promociones',
  templateUrl: './promociones.component.html',
  styleUrls: ['./promociones.component.scss']
})
export class PromocionesComponent implements OnInit {

  promos: any[] = [];

  constructor(
    private api: ApiService,
    private titleService: Title,
    private metaService: Meta
  ) {}

  ngOnInit(): void {
    const title = 'Promociones LEGO | 2x1, segunda unidad -50%, regalos y puntos | Fandery';
    const description = 'Promociones LEGO explicadas y verificadas: 2x1, segunda unidad al 50%, regalos con compra, cupones y puntos extra. Condiciones, fechas y tiendas.';
    this.titleService.setTitle(title);
    this.metaService.updateTag({
      name: 'description',
      content: description
    });

    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({ property: 'og:description', content: description });

    this.api.getPromos().subscribe(promos => {
      this.promos = promos;
    });
  }

}
