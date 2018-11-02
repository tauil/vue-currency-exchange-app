import { Component, OnInit } from '@angular/core';
import { ConvertService } from '../services/convert.service';
import { ActivatedRoute } from '@angular/router';
import { Conversion } from '../interfaces/conversion';

@Component({
  selector: 'app-convert-currency',
  templateUrl: './convert-currency.component.html',
  styleUrls: ['./convert-currency.component.scss']
})
export class ConvertCurrencyComponent implements OnInit {

  fromCurrency: string;
  toCurrency: string = 'USD'; // nomics only provides exchange to USD.
  initialAmount: number;
  rate: number;
  inverseRate: number;
  isLoading: boolean = false;
  conversion: Conversion;

  constructor(public convertService: ConvertService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (!(params.hasOwnProperty('amount') && params.hasOwnProperty('from') && params.hasOwnProperty('to'))) return;
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
    this.isLoading = true;
    const myObserver = {
      next: result => {
        this.conversion = result;
        this.isLoading = false;
      },
      error: err => console.error('Observer got an error: ' + err),
      complete: () => console.log('Observer got a complete notification'),
    };
    this.convertService.convert(this.initialAmount, this.fromCurrency, this.toCurrency).subscribe(myObserver)
  }

}
