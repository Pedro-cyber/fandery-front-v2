import { Component, OnInit, PLATFORM_ID, Inject, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Product } from '../../models/product.model';
import { HistoricalData } from 'src/app/models/historical-data';
import { Title, Meta } from '@angular/platform-browser';
import { SpintaxService } from '../../services/spintax.service';
import { TransferStateService, IdleMonitorService } from '@scullyio/ng-lib';
import SwiperCore, { Navigation, Pagination, Autoplay, Lazy } from 'swiper';
import { map, take, catchError } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  id: string = '';
  product: Product | null = null;
  historicalData: HistoricalData[] = [];
  relatedProducts: Product[] = [];
  isDescriptionOpen = false;
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
    private ims: IdleMonitorService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      SwiperCore.use([Navigation, Pagination, Autoplay, Lazy]);
    }

    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        const parts = slug.split('-');
        const legoId = parts[parts.length - 1];
        if (this.id !== legoId) {
          this.id = legoId;
          this.loadProductData(legoId, slug);
        }
      }
    });
  }

  loadProductData(id: string, slug: string): void {
    // 1. Definimos los observables
    const product$ = this.api.getProductById(id).pipe(
      map(res => ({ ...res.set, precios: res.precios })),
      catchError(() => of(null)),
      take(1)
    );

    const history$ = this.api.getHistoricalData(id).pipe(
      catchError(() => of([])),
      take(1)
    );

    // 2. LA SOLUCIÓN: Forzamos 'as any' en el forkJoin para que Scully lo acepte
    // sin pelearse por la versión de RxJS
    const combined$ = forkJoin([product$, history$]) as any;

    this.transferState.useScullyTransferState(
      `allData-${id}`,
      combined$
    ).subscribe((data: any) => {
      // Scully nos devuelve el array, lo extraemos con cuidado
      if (data && Array.isArray(data)) {
        const [product, history] = data;

        if (product) {
          this.product = product as Product;
          this.historicalData = history as HistoricalData[];

          this.applyMetadata(this.product, slug);
          this.loadRelatedProducts(this.product.theme);

          if (!this.isBrowser) {
            this.cdr.detectChanges();
            setTimeout(() => {
              this.ims.fireManualMyAppReadyEvent();
            }, 100);
          }
        } else {
          if (!this.isBrowser) this.ims.fireManualMyAppReadyEvent();
        }
      } else {
        // Fallback si la data no viene como array
        if (!this.isBrowser) this.ims.fireManualMyAppReadyEvent();
      }
    });
  }
  loadRelatedProducts(theme: string): void {
    // Los relacionados no suelen ser críticos para el TransferState de la PDP
    // pero los cargamos igualmente de forma eficiente
    this.api.searchByTheme(theme).pipe(
      map(res => res.filter((p: Product) => p.legoId !== this.id).slice(0, 8)),
      take(1),
      catchError(() => of([]))
    ).subscribe(related => {
      this.relatedProducts = related;
      if (!this.isBrowser) this.cdr.detectChanges();
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

    if (!this.isBrowser) {
      this.updateProductSchema(product, slug);
    }
  }

  updateProductSchema(product: Product, slug: string): void {
    let minPrice = product.precios?.length ? Math.min(...product.precios.map(p => p.price)) : 0;
    let maxPrice = product.precios?.length ? Math.max(...product.precios.map(p => p.price)) : 0;

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
