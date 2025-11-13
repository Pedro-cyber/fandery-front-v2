import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-promo-list',
  templateUrl: './promo-list.component.html',
  styleUrls: ['./promo-list.component.scss']
})
export class PromoListComponent  {

  @Input() promos: any[] = [];

}
