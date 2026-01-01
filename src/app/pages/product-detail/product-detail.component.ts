import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Product } from '../../models/product.model';
import { HistoricalData } from 'src/app/models/historical-data';
import { Title, Meta } from '@angular/platform-browser';
import { SpintaxService } from '../../services/spintax.service'; // ✅ importar servicio

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  id: string = '';
  product: Product | null = null;
  historicalData: HistoricalData[] = [];

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private titleService: Title,
    private metaService: Meta,
    private spintax: SpintaxService // ✅ inyección del servicio
  ) {}

  themeImages: { [key: string]: string } = {
    'Star Wars': 'assets/images/themes/star-wars.png',
    'City': 'assets/images/themes/city.png',
    'Technic': 'assets/images/themes/technic.png',
    'Marvel Super Heroes': 'assets/images/themes/marvel.png',
    'Friends': 'assets/images/themes/friends.png',
    'Duplo': 'assets/images/themes/duplo.png',
    'Creator': 'assets/images/themes/creator-expert.png',
    'Ninjago': 'assets/images/themes/ninjago.png',
    'Disney': 'assets/images/themes/disney.png',
    'Harry Potter': 'assets/images/themes/harry-potter.png',
    'Speed Champions': 'assets/images/themes/speed-champions.png',
    'Icons': 'assets/images/themes/icons.png',
    'Minecraft': 'assets/images/themes/minecraft.png',
    'Super Mario': 'assets/images/themes/super-mario.png',
    'Classic': 'assets/images/themes/classic.png',
    'Dreamzzz': 'assets/images/themes/dreamzzz.png',
    'Animal Crossing': 'assets/images/themes/animal-crossing.png',
    'Sonic the Hedgehog': 'assets/images/themes/sonic-the-hedgehog.png',
    'DC Comics Super Heroes': 'assets/images/themes/dc.png',
    'Art': 'assets/images/themes/art.png',
    "Gabby's Dollhouse": 'assets/images/themes/gabby-s-dollhouse.png',
    'Jurassic World': 'assets/images/themes/jurassic-world.png',
    'Botanicals': 'assets/images/themes/botanicals.png',
    'Wicked': 'assets/images/themes/wicked.png',
    'Despicable Me': 'assets/images/themes/minions.png',
    'Fortnite': 'assets/images/themes/fortnite.png',
    'Architecture': 'assets/images/themes/architecture.png',
    'Ideas': 'assets/images/themes/ideas.png',
    'Wednesday': 'assets/images/themes/wednesday.png',
    'Bluey': 'assets/images/themes/bluey.png',
    'One Piece': 'assets/images/themes/one-piece.png',
    'Monkie Kid': 'assets/images/themes/monkie-kid.png',
    'BrickHeadz': 'assets/images/themes/brickheadz.png'
  };

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        const parts = slug.split('-');
        const legoId = parts[parts.length - 1];
        this.id = legoId;

        this.loadProduct(legoId, slug);
        this.getHistoricalData(legoId);
      }
    });
  }

  loadProduct(id: string, slug: string): void {
    this.api.getProductById(id).subscribe(response => {
      this.product = {
        ...response.set,
        precios: response.precios
      };

      if (this.product) {
        const setNumber = this.product.legoId || id;
        const setName = this.product.name_es || this.product.name || 'LEGO Set';
        const variables = { set_number: setNumber, set_name: setName };

        // 🧠 Plantillas Spintax
        const titleTemplate =
          'LEGO {{set_number}} {{set_name}} – {Compara precios y ahorra|Compara precios y ofertas|Encuentra el mejor precio|Ofertas y precios actualizados|Descubre las mejores ofertas} | Fandery';

        const descriptionTemplate =
          'LEGO {{set_number}} {{set_name}} {al mejor precio|con las mejores ofertas|a precio imbatible}. {Compara precios actualizados|Consulta precios verificados|Explora las mejores ofertas} en {tiendas oficiales|las principales tiendas|las mejores tiendas online} y {descubre las mejores promociones|ahorra con Fandery|encuentra tu mejor opción|no pagues de más con Fandery}.';

        // 🪄 Generar textos deterministas
        const metaTitle = this.spintax.generate(titleTemplate, variables, setNumber);
        const metaDescription = this.spintax.generate(descriptionTemplate, variables, setNumber);

        // ✅ Aplicar al documento
        this.titleService.setTitle(metaTitle);
        this.metaService.updateTag({ name: 'description', content: metaDescription });
        this.metaService.updateTag({ property: 'og:title', content: metaTitle });
        this.metaService.updateTag({ property: 'og:description', content: metaDescription });
        this.metaService.updateTag({ property: 'og:image', content: this.product.image });
        this.metaService.updateTag({ name: 'twitter:title', content: metaTitle });
        this.metaService.updateTag({ name: 'twitter:description', content: metaDescription });
        this.metaService.updateTag({ name: 'twitter:image', content: this.product.image });
        this.addProductSchema(this.product, slug);
      } else {
        this.titleService.setTitle(`Detalle del producto | Fandery`);
      }
    });
  }

  getHistoricalData(id: string): void {
    this.api.getHistoricalData(id).subscribe(response => {
      this.historicalData = response;
    });
  }

  addProductSchema(product: Product, slug:string): void {
  if (!product) return;

  let minPrice = product.precios && product.precios.length > 0 ? product.precios[0].price : 0;
  let maxPrice = product.precios && product.precios.length > 0 ? product.precios[0].price : 0;

  product.precios?.forEach(p => {
    if (p.price < minPrice) minPrice = p.price;
    if (p.price > maxPrice) maxPrice = p.price;
  });

  const url = `https://www.fandery.com/sets/${slug}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": url,
    "name": product.name_es || product.name || `LEGO Set ${this.id}`,
    "description": product.description_es || `Descubre el set LEGO ${product.name_es || this.id}. Compara precios en tiendas oficiales.`,
    "image": product.image,
    "brand": {
      "@type": "Brand",
      "name": "LEGO"
    },
    "sku": product.legoId || this.id,
    "url": `https://www.fandery.com/sets/${this.id}`,
    "category": product.theme || "Juguetes y juegos > Construcción > LEGO",
    "offers": {
      "@type": "AggregateOffer",
      "url": url,
      "priceCurrency": "EUR",
      "lowPrice": minPrice || 0,
      "highPrice": maxPrice || 0,
      "offerCount": product.precios?.length || 1,
      "availability": "https://schema.org/InStock"
    }
  };

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(schema, null, 2);
  document.head.appendChild(script);
}

}
