import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-filter-toggle',
  templateUrl: './filter-toggle.component.html',
  styleUrls: ['./filter-toggle.component.scss']
})
export class FilterToggleComponent {

  @Input() filter: 'all' | 'offers' = 'all';
  @Output() filterChange = new EventEmitter<'all' | 'offers'>();

  setFilter(filter: 'all' | 'offers') {
    if (this.filter !== filter) {
      this.filterChange.emit(filter);
    }
  }
}

