import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Transaction {
  id?: number;
  category: string;
  amount: number;
  date: string; // ISO date string
  type: TransactionType;
  notes?: string;
}

export enum TransactionType {
  Income = 0,
  Expense = 1
}

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = 'https://localhost:5136/api/transaction';

  constructor(private http: HttpClient) { }

  getAllTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.apiUrl);
  }

  getTransaction(id: number): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.apiUrl}/${id}`);
  }

  createTransaction(transaction: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.apiUrl}/create`, transaction);
  }

  updateTransaction(id: number, transaction: Transaction): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, transaction);
  }

  deleteTransaction(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getTransactionsOrderedByAmount(order: 'asc' | 'desc' = 'desc'): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/ordered-by-amount?order=${order}`);
  }

  getTransactionsByExactAmount(amount: number): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/by-amount/${amount}`);
  }

  getTransactionsByAmountRange(min: number, max: number): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/by-amount-range?min=${min}&max=${max}`);
  }

  getTransactionsGreaterThan(amount: number): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/greater-than/${amount}`);
  }

  getTransactionsLessThan(amount: number): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/less-than/${amount}`);
  }

  getIncomeTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}?type=${TransactionType.Income}`);
  }

  getExpenseTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}?type=${TransactionType.Expense}`);
  }
  
}
