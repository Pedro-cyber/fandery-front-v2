import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent {
  @Input() currentPage = 1;
  @Input() totalItems = 0;
  @Input() pageSize = 24;

  @Output() pageChange = new EventEmitter<number>();

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  get pagesToShow(): (number | string)[] {
    const pages: (number | string)[] = [];
    const total = this.totalPages;

    if (total <= 7) {
      // Mostrar todas si son pocas
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (this.currentPage > 4) {
        pages.push('...');
      }

      const start = Math.max(2, this.currentPage - 1);
      const end = Math.min(total - 1, this.currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (this.currentPage < total - 3) {
        pages.push('...');
      }

      pages.push(total);
    }

    return pages;
  }

  // ✅ Llamado solo desde los botones
  onPageClick(p: number | string) {
    if (typeof p === 'number') {
      this.changePage(p);
    }
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }
}
