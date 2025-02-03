// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

// interface PaymentRequest {
//   amount: number;
//   phone: string;
//   paybill: string;
// }

// interface PaymentResponse {
//   status: string;
//   message: string;
//   transactionId?: string;
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class PaymentService {
//   private apiUrl = 'http://localhost:5000/api/mpesa/charge'

//   constructor(private http: HttpClient) {}

//   initiatePayment(data: PaymentRequest): Observable<PaymentResponse> {
//     return this.http.post<PaymentResponse>(this.apiUrl, data);
//   }
// }


import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

interface PaymentRequest {
  amount: number;
  phone: string;
  paybill: string;
  reference?: string;
}

interface PaymentResponse {
  status: string;
  message: string;
  transactionId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  initiatePayment(data: PaymentRequest): Observable<PaymentResponse> {
    return from(
      this.supabase.functions.invoke('mpesa-charge', {
        body: {
          amount: data.amount,
          phone: data.phone,
          paybill: data.paybill,
          reference: data.reference || Math.random().toString(36).substring(7)
        }
      })
    );
  }

  getTransactionHistory(): Observable<any> {
    return from(
      this.supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false })
    );
  }
}
