import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Product } from '../../models/product.model';
import { HistoricalData } from 'src/app/models/historical-data';
import { Title, Meta } from '@angular/platform-browser';
import { SpintaxService } from '../../services/spintax.service';
import { TransferStateService } from '@scullyio/ng-lib';
import SwiperCore, { Navigation, Pagination, Autoplay, Lazy } from 'swiper';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

SwiperCore.use([Navigation, Pagination, Autoplay, Lazy]);

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  id: string = '';
  product: Product | null = null;
  historicalData: HistoricalData[] = [];
  isDescriptionOpen = false;
  relatedProducts: Product[] = [];
  isBrowser: boolean;

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

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private titleService: Title,
    private metaService: Meta,
    private spintax: SpintaxService,
    private transferState: TransferStateService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        const parts = slug.split('-');
        const legoId = parts[parts.length - 1];

        if (this.id !== legoId) {
          this.id = legoId;
          this.product = null;
          this.historicalData = [];
          this.loadProduct(legoId, slug);
          this.getHistoricalData(legoId);
        }
      }
    });
  }

  loadProduct(id: string, slug: string): void {
    // Scully necesita el observable directamente para poder guardarlo en el JSON
    const productObservable = this.api.getProductById(id).pipe(
      map(response => ({
        ...response.set,
        precios: response.precios
      }))
    );

    this.transferState.useScullyTransferState('productData', productObservable as any)
      .subscribe((product: any) => {
        if (product) {
          this.product = product as Product;
          this.applyMetadata(this.product, slug);
          this.loadRelatedProducts(this.product.theme);
        }
      });
  }

  getHistoricalData(id: string): void {
    const historyObservable = this.api.getHistoricalData(id);

    this.transferState.useScullyTransferState('historyData', historyObservable as any)
      .subscribe((history: any) => {
        if (history) {
          this.historicalData = history as HistoricalData[];
        }
      });
  }

  loadRelatedProducts(theme: string): void {
    const relatedObservable = this.api.searchByTheme(theme).pipe(
      map(response => response.filter((p: Product) => p.legoId !== this.id).slice(0, 8))
    );

    this.transferState.useScullyTransferState('relatedProducts', relatedObservable as any)
      .subscribe((related: any) => {
        if (related) {
          this.relatedProducts = related as Product[];
        }
      });
  }

  toggleDescription() {
    this.isDescriptionOpen = !this.isDescriptionOpen;
  }

  applyMetadata(product: Product, slug: string): void {
    if (!product) return;

    const setNumber = product.legoId || this.id;
    const setName = product.name_es || product.name || 'LEGO Set';
    const variables = { set_number: setNumber, set_name: setName };

    const titleTemplate = 'LEGO {{set_number}} {{set_name}} – {Compara precios y ahorra|Encuentra el mejor precio} | Fandery';
    const descriptionTemplate = 'LEGO {{set_number}} {{set_name}} {al mejor precio|con las mejores ofertas}.';

    const metaTitle = this.spintax.generate(titleTemplate, variables, setNumber);
    const metaDescription = this.spintax.generate(descriptionTemplate, variables, setNumber);

    this.titleService.setTitle(metaTitle);
    this.metaService.updateTag({ name: 'description', content: metaDescription });
    this.metaService.updateTag({ property: 'og:title', content: metaTitle });
    this.metaService.updateTag({ property: 'og:image', content: product.image });

    if (this.isBrowser || typeof document !== 'undefined') {
      this.updateProductSchema(product, slug);
    }
  }

  updateProductSchema(product: Product, slug: string): void {
    const oldScript = document.getElementById('product-schema');
    if (oldScript) oldScript.remove();

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
      "name": product.name_es || product.name || `LEGO Set ${this.id}`,
      "description": product.description_es || '',
      "image": product.image,
      "brand": { "@type": "Brand", "name": "LEGO" },
      "sku": product.legoId || this.id,
      "offers": {
        "@type": "AggregateOffer",
        "priceCurrency": "EUR",
        "lowPrice": minPrice,
        "highPrice": maxPrice,
        "offerCount": product.precios?.length || 1,
        "availability": "https://schema.org/InStock"
      }
    };

    const script = document.createElement('script');
    script.id = 'product-schema';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);
  }
}
