// import { Component } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { RouterLink } from '@angular/router';


// @Component({
//   selector: 'app-payment',
//   imports: [FormsModule, RouterLink],
//   templateUrl: './payment.component.html',
//   styleUrl: './payment.component.css'
// })
// export class PaymentComponent {
//   amount: number | null = null;
//   paybill: string = '';
//   phone: string = '';

// }
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment',
  imports: [FormsModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent {
  amount: number | null = null;
  paybill: string = '';
  phone: string = '';

  constructor(private router: Router) {}


  onPaymentClick() {

    this.processPayment()
      .then(() => {

        this.router.navigate(['/success']);
      })
      .catch(error => {

        console.error('Payment failed:', error);
      });
  }


  private processPayment(): Promise<void> {
    return new Promise((resolve, reject) => {

      setTimeout(() => {
        resolve();  
      }, 1000);
    });
  }
}





