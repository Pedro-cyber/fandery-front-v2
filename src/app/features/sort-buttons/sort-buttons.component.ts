import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sort-buttons',
  templateUrl: './sort-buttons.component.html',
  styleUrls: ['./sort-buttons.component.scss']
})
export class SortButtonsComponent {
  @Input() sortOrder: 'priceAsc' | 'priceDesc' | 'discountAsc' | 'discountDesc' = 'discountDesc';
  @Output() sortChange = new EventEmitter<'priceAsc' | 'priceDesc' | 'discountAsc' | 'discountDesc'>();

  setSort(order: 'priceAsc' | 'priceDesc' | 'discountAsc' | 'discountDesc') {
    this.sortChange.emit(order);
  }
}
