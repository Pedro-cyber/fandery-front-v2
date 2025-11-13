import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-category-selector',
  templateUrl: './category-selector.component.html',
  styleUrls: ['./category-selector.component.scss']
})
export class CategorySelectorComponent {

  @Input() themes: any[] = [];

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


}
