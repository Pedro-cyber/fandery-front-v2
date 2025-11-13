import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-best-deals',
  templateUrl: './best-deals.component.html',
  styleUrls: ['./best-deals.component.scss']
})
export class BestDealsComponent {

  @Input() deals: any[] = [];

  getFilteredDeals(): any[] {
    return this.deals
      .filter(deal => deal.theme !== 'Friends' && deal.theme !== 'Duplo' && deal.theme !== 'Dots' && deal.pieces > 1)
      .slice(0, 20);
  }


}
