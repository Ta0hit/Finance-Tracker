import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Transaction, TransactionType } from '../services/transaction';

@Component({
  selector: 'app-transaction-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transaction-summary.html',
  styleUrl: './transaction-summary.css'
})
export class TransactionSummaryComponent {
  // Input properties
  transactions = input.required<Transaction[]>();

  // Computed properties for calculations
  totalIncome = computed(() => {
    return this.transactions()
      .filter(t => t.type === TransactionType.Income)
      .reduce((sum, t) => sum + t.amount, 0);
  });

  totalExpenses = computed(() => {
    return this.transactions()
      .filter(t => t.type === TransactionType.Expense)
      .reduce((sum, t) => sum + t.amount, 0);
  });

  balance = computed(() => {
    return this.totalIncome() - this.totalExpenses();
  });

  // Computed properties for transaction counts
  incomeTransactionCount = computed(() => {
    return this.transactions().filter(t => t.type === TransactionType.Income).length;
  });

  expenseTransactionCount = computed(() => {
    return this.transactions().filter(t => t.type === TransactionType.Expense).length;
  });

  // Helper method to determine if balance is positive
  isBalancePositive = computed(() => {
    return this.balance() >= 0;
  });

  // Helper method to format currency
  formatCurrency(amount: number): string {
    return amount.toFixed(2);
  }
}
