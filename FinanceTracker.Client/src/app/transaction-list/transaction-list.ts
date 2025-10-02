import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Transaction, TransactionType } from '../services/transaction';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transaction-list.html',
  styleUrl: './transaction-list.css'
})
export class TransactionListComponent {
  // Input properties
  transactions = input.required<Transaction[]>();
  loading = input<boolean>(false);

  // Output events
  onDeleteTransaction = output<number>();

  // Helper method for transaction type text
  getTransactionTypeText(type: TransactionType): string {
    return type === TransactionType.Income ? 'Income' : 'Expense';
  }

  // Helper method for transaction type CSS class
  getTransactionTypeClass(type: TransactionType): string {
    return type === TransactionType.Income ? 'income' : 'expense';
  }

  // Handle delete transaction
  deleteTransaction(id: number) {
    this.onDeleteTransaction.emit(id);
  }
}
