import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.scss']
})
export class CategoriasComponent implements OnInit {

  themes: any[] = [];
  constructor(private api: ApiService,
    private titleService: Title,
    private metaService: Meta) {}

  ngOnInit(): void {
    const title = 'Categorías LEGO | Explora tus líneas favoritas con descuentos | Fandery';
    const description = 'Explora todas las categorías LEGO en Fandery: Star Wars, Ideas, Icons, Technic, Harry Potter, City, Disney y más. Encuentra sets, novedades y ofertas por temática.';
    this.titleService.setTitle(title);
    this.metaService.updateTag({
      name: 'description',
      content: description
    });

    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({ property: 'og:description', content: description });

    this.api.getThemes().subscribe(themes => {
      this.themes = themes;
    });
  }

}
