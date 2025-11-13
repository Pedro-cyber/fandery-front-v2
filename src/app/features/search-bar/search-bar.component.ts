import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {
  keyword: string = '';

  searchTerm = '';

  constructor(private router: Router) {}


  onSearch() {
    if (this.searchTerm.trim()) {
      this.router.navigate(['/product-list'], {
        queryParams: { q: this.searchTerm }
      });
    }
  }
}

