import { Component, output, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface TransactionFormData {
  category: string;
  amount: number;
  date: string;
  type: number;
  notes: string;
}

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transaction-form.html',
  styleUrl: './transaction-form.css'
})
export class TransactionFormComponent {
  // Input properties
  loading = input<boolean>(false);

  // Output events
  onSubmit = output<TransactionFormData>();

  // Form data
  newTransactionForm = signal<TransactionFormData>({
    category: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0], // Today's date
    type: 1, // Default to expense
    notes: ''
  });

  addTransaction() {
    const formData = this.newTransactionForm();

    // Basic validation - amount can be 0, so check for null/undefined specifically
    if (!formData.category || formData.amount <= 0 || !formData.date) {
      console.log('Validation failed:', formData);
      return;
    }

    console.log('Submitting transaction:', formData);

    // Emit the form data
    this.onSubmit.emit(formData);

    // Reset form
    this.newTransactionForm.set({
      category: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      type: 1,
      notes: ''
    });
  }

  // Update individual form fields
  updateCategory(value: string) {
    this.newTransactionForm.update(form => ({ ...form, category: value }));
  }

  updateAmount(value: number) {
    this.newTransactionForm.update(form => ({ ...form, amount: value }));
  }

  updateDate(value: string) {
    this.newTransactionForm.update(form => ({ ...form, date: value }));
  }

  updateType(value: number) {
    this.newTransactionForm.update(form => ({ ...form, type: value }));
  }

  updateNotes(value: string) {
    this.newTransactionForm.update(form => ({ ...form, notes: value }));
  }
}
