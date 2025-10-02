import { Component, output, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface FilterOptions {
  minAmount?: number;
  maxAmount?: number;
}

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filters.html',
  styleUrl: './filters.css'
})
export class FiltersComponent {
  // Input properties
  sortOrder = input<string>('desc');

  // Output events
  onSortByAmount = output<string>();
  onClearFilters = output<void>();

  // Filter form data
  filterMinAmount = signal<number | null>(null);
  filterMaxAmount = signal<number | null>(null);

  sortByAmount(order: string) {
    this.onSortByAmount.emit(order);
  }

  clearFilters() {
    this.filterMinAmount.set(null);
    this.filterMaxAmount.set(null);
    this.onClearFilters.emit();
  }

  updateMinAmount(value: string) {
    const num = value ? parseFloat(value) : null;
    this.filterMinAmount.set(num);
  }

  updateMaxAmount(value: string) {
    const num = value ? parseFloat(value) : null;
    this.filterMaxAmount.set(num);
  }
}
