
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PaymentService } from '../services/payment.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
  providers: [PaymentService]
})
export class PaymentComponent {
  amount: number | null = null;
  paybill: string = '';
  phone: string = '';
  isProcessing: boolean = false;
  error: string | null = null;

  constructor(
    private router: Router,
    private paymentService: PaymentService
  ) {}

  onPaymentClick() {
    if (!this.amount || !this.paybill || !this.phone) {
      this.error = 'Please fill in all fields';
      return;
    }

    this.isProcessing = true;
    this.error = null;

    this.paymentService.initiatePayment({
      amount: this.amount,
      phone: this.phone,
      paybill: this.paybill
    }).subscribe({
      next: (response) => {
        console.log('Payment initiated:', response);
        this.isProcessing = false;
        this.router.navigate(['/success']);
      },
      error: (error) => {
        console.error('Payment failed:', error);
        this.isProcessing = false;
        this.error = 'Payment failed. Please try again.';
      }
    });
  }
}
