import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import SwiperCore, { Navigation, Pagination, Autoplay, Lazy } from 'swiper';

SwiperCore.use([Navigation, Pagination, Autoplay, Lazy]);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  bestDeals: any[] = [];
  promos: any[] = [];
  themes: any[] = [];
  featured: any[] = [];
  filteredThemes: any[] = [];
  constructor(private api: ApiService) {}

  themeImages: { [key: string]: string } = {
    'Star Wars': 'assets/images/themes/banner/star-wars-banner.webp',
    'City': 'assets/images/themes/banner/city-banner.webp',
    'Technic': 'assets/images/themes/banner/technic-banner.webp',
    'Marvel Super Heroes': 'assets/images/themes/banner/marvel-banner.webp',
    'Friends': 'assets/images/themes/banner/friends-banner.webp',
    'Duplo': 'assets/images/themes/banner/duplo-banner.webp',
    'Creator': 'assets/images/themes/banner/creator-banner.webp',
    'Ninjago': 'assets/images/themes/banner/ninjago-banner.webp',
    'Disney': 'assets/images/themes/banner/disney-banner.webp',
    'Harry Potter': 'assets/images/themes/banner/harry-potter-banner.webp',
    'Speed Champions': 'assets/images/themes/banner/speed-champions-banner.webp',
    'Icons': 'assets/images/themes/banner/icons-banner.webp',
    'Minecraft': 'assets/images/themes/banner/minecraft-banner.webp',
    'Super Mario': 'assets/images/themes/banner/super-mario-banner.webp',
    'Classic': 'assets/images/themes/banner/classic-banner.webp',
    'Dreamzzz': 'assets/images/themes/banner/dreamzzz-banner.webp',
    'Animal Crossing': 'assets/images/themes/banner/animal-crossing-banner.webp',
    'Sonic the Hedgehog': 'assets/images/themes/banner/sonic-banner.webp',
    'DC Comics Super Heroes': 'assets/images/themes/banner/dc-banner.webp',
    'Art': 'assets/images/themes/banner/art-banner.webp',
    "Gabby's Dollhouse": 'assets/images/themes/banner/gabby-s-dollhouse-banner.webp',
    'Jurassic World': 'assets/images/themes/banner/jurassic-world-banner.webp',
    'Botanicals': 'assets/images/themes/banner/botanicals-banner.webp',
    'Wicked': 'assets/images/themes/banner/wicked-banner.webp',
    'Despicable Me': 'assets/images/themes/banner/minions-banner.webp',
    'Fortnite': 'assets/images/themes/banner/fortnite-banner.webp',
    'Architecture': 'assets/images/themes/banner/architecture-banner.webp',
    'Ideas': 'assets/images/themes/banner/ideas-banner.webp',
    'Wednesday': 'assets/images/themes/banner/wednesday-banner.webp',
    'Bluey': 'assets/images/themes/banner/bluey-banner.webp',
    'One Piece': 'assets/images/themes/banner/one-piece-banner.webp',
    'Monkie Kid': 'assets/images/themes/banner/monkie-kid-banner.webp',
    'BrickHeadz': 'assets/images/themes/banner/brickheadz-banner.webp'
  };

  activeTab: 'search' | 'categories' = 'search';

  toggleTab(tab: 'search' | 'categories') {
    this.activeTab = tab;
  }
  ngOnInit() {
    this.api.getBestDeals().subscribe(deals => {
      this.bestDeals = deals.sort((a, b) => (b.descuento || 0) - (a.descuento || 0));
    });

    this.api.getThemes().subscribe(themes => {
      this.themes = themes;
      this.filteredThemes = this.themes.filter(theme => this.themeImages[theme._id]);
    });

    this.api.getPromos().subscribe(promos => {
      this.promos = promos;
    });

    this.api.getFeaturedProducts().subscribe(featured => {
      this.featured = featured;
    });

  }

}
