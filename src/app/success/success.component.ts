
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css']
})
export class SuccessComponent implements OnInit {
  amount: string | null = null;
  paybill: string | null = null;
  phone: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.amount = this.route.snapshot.queryParamMap.get('amount');
    this.paybill = this.route.snapshot.queryParamMap.get('paybill');
    this.phone = this.route.snapshot.queryParamMap.get('phone');
  }
}

