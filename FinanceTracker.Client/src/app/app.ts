import { Component, signal, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionService, Transaction, TransactionType } from './services/transaction';
import { TransactionFormComponent, TransactionFormData } from './transaction-form/transaction-form';
import { TransactionListComponent } from './transaction-list/transaction-list';
import { TransactionSummaryComponent } from './transaction-summary/transaction-summary';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, FormsModule, TransactionFormComponent, TransactionListComponent, TransactionSummaryComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('Finance Tracker');

  // Inject the transaction service
  private transactionService = inject(TransactionService);

  // Signals for reactive data
  transactions = signal<Transaction[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  // Filter properties (not signals)
  sortOrder = signal<'asc' | 'desc'>('desc');
  filterMinAmount: number | null = null;
  filterMaxAmount: number | null = null;

  ngOnInit() {
    this.loadTransactions();
  }

  // Load all transactions
  loadTransactions() {
    this.loading.set(true);
    this.error.set(null);

    this.transactionService.getAllTransactions().subscribe({
      next: (data) => {
        this.transactions.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load transactions');
        this.loading.set(false);
        console.error('Error loading transactions:', err);
      }
    });
  }

  // Handle transaction form submission
  handleTransactionSubmit(formData: TransactionFormData) {
    this.loading.set(true);

    const transaction: Transaction = {
      category: formData.category,
      amount: formData.amount,
      date: formData.date,
      type: formData.type as TransactionType,
      notes: formData.notes
    };

    this.transactionService.createTransaction(transaction).subscribe({
      next: (created) => {
        // Add the new transaction to the list
        this.transactions.update(current => [...current, created]);
        this.loading.set(false);
        this.error.set(null);
      },
      error: (err) => {
        this.error.set('Failed to create transaction');
        this.loading.set(false);
        console.error('Error creating transaction:', err);
      }
    });
  }

  // Delete a transaction
  deleteTransaction(id: number) {
    this.transactionService.deleteTransaction(id).subscribe({
      next: () => {
        // Remove from the list
        this.transactions.update(current =>
          current.filter(t => t.id !== id)
        );
      },
      error: (err) => {
        this.error.set('Failed to delete transaction');
        console.error('Error deleting transaction:', err);
      }
    });
  }

  // Sort transactions by amount
  sortByAmount(order: 'asc' | 'desc') {
    this.sortOrder.set(order);
    this.loading.set(true);

    this.transactionService.getTransactionsOrderedByAmount(order).subscribe({
      next: (data) => {
        this.transactions.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to sort transactions');
        this.loading.set(false);
        console.error('Error sorting transactions:', err);
      }
    });
  }

  // Filter by amount range
  filterByAmountRange() {
    if (this.filterMinAmount === null || this.filterMaxAmount === null) {
      this.loadTransactions(); // Show all if no filter
      return;
    }

    this.loading.set(true);
    this.transactionService.getTransactionsByAmountRange(this.filterMinAmount, this.filterMaxAmount).subscribe({
      next: (data) => {
        this.transactions.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to filter transactions');
        this.loading.set(false);
        console.error('Error filtering transactions:', err);
      }
    });
  }

  // Clear filters
  clearFilters() {
    this.filterMinAmount = null;
    this.filterMaxAmount = null;
    this.loadTransactions();
  }

  // Get transaction type display text
  getTransactionTypeText(type: TransactionType): string {
    return type === TransactionType.Income ? 'Income' : 'Expense';
  }

  // Get CSS class for transaction type
  getTransactionTypeClass(type: TransactionType): string {
    return type === TransactionType.Income ? 'income' : 'expense';
  }

  // Summary methods
  getTotalIncome(): number {
    return this.transactions()
      .filter(t => t.type === TransactionType.Income)
      .reduce((sum, t) => sum + t.amount, 0);
  }

  getTotalExpenses(): number {
    return this.transactions()
      .filter(t => t.type === TransactionType.Expense)
      .reduce((sum, t) => sum + t.amount, 0);
  }

  getBalance(): number {
    return this.getTotalIncome() - this.getTotalExpenses();
  }
}
