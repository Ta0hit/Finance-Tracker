import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Transaction {
  id?: number;
}

@Injectable({
  providedIn: 'root'
})
export class Transaction {

}
