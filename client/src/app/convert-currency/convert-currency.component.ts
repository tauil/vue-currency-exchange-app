import { Component, OnInit } from '@angular/core';
import { ConvertService } from '../services/convert.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-convert-currency',
  templateUrl: './convert-currency.component.html',
  styleUrls: ['./convert-currency.component.scss']
})
export class ConvertCurrencyComponent implements OnInit {

  fromCurrency: string;
  toCurrency: string = 'USD'; // nomics only provides exchange to USD.
  initialAmount: number;
  finalAmount: number;
  rate: number;
  inverseRate: number;

  constructor(public convertService: ConvertService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      console.log(params)
      this.initialAmount = params['amount'];
      this.fromCurrency = params['from'];
      this.toCurrency = params['to'];
      this.convert();
    });
  }

  invertCurrencies() {
    let fromCurrency = this.fromCurrency;
    this.fromCurrency = this.toCurrency;
    this.toCurrency = fromCurrency;
  }

  convert() {
    const myObserver = {
      next: result => {
        this.finalAmount = result["finalAmount"];
        this.rate = result["rate"];
        this.inverseRate = result["inverseRate"];
      },
      error: err => console.error('Observer got an error: ' + err),
      complete: () => console.log('Observer got a complete notification'),
    };
    this.convertService.convert(this.initialAmount, this.fromCurrency, this.toCurrency).subscribe(myObserver)
  }

}
