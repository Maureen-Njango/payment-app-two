// import { Routes } from '@angular/router';

// export const routes: Routes = [];
import { Routes } from '@angular/router';
import { PaymentComponent } from './payment/payment.component';
import { SuccessComponent } from './success/success.component';

export const routes: Routes = [
  // Define your server routes here
  { path: '', redirectTo: 'payment', pathMatch: 'full' },
  { path: 'payment', component: PaymentComponent },
  { path: 'success', component: SuccessComponent }

];
