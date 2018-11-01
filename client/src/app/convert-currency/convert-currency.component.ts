import { Component, OnInit } from '@angular/core';
import { ConvertService } from '../services/convert.service';

@Component({
  selector: 'app-convert-currency',
  templateUrl: './convert-currency.component.html',
  styleUrls: ['./convert-currency.component.scss']
})
export class ConvertCurrencyComponent implements OnInit {

  fromCurrency: string;
  toCurrency: string = 'USD'; // nomics only provides exchange to USD.
  fromAmount: number;
  toAmount: number;
  rate: number;
  inverseRate: number;

  constructor(public convertService: ConvertService) { }

  ngOnInit() {
  }

  invertCurrencies() {
    let fromCurrency = this.fromCurrency;
    this.fromCurrency = this.toCurrency;
    this.toCurrency = fromCurrency;
  }

  convert() {
    const myObserver = {
      next: result => {
        this.toAmount = result["finalAmount"];
        this.rate = result["rate"];
        this.inverseRate = result["inverseRate"];
      },
      error: err => console.error('Observer got an error: ' + err),
      complete: () => console.log('Observer got a complete notification'),
    };
    this.convertService.convert(this.fromAmount, this.fromCurrency, this.toCurrency).subscribe(myObserver)
  }

}
