


import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environment/environment';
import { map } from 'rxjs/operators';

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
    ).pipe(
      map(response => {
        if (response.error) {
          throw new Error(response.error.message);
        }
        return {
          status: response.data?.status || 'failed',
          message: response.data?.message || 'No message provided',
          transactionId: response.data?.transactionId
        } as PaymentResponse;
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
