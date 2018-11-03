import { Component, OnInit } from '@angular/core';
import { ConvertService } from '../services/convert.service';
import { ActivatedRoute } from '@angular/router';
import { Conversion } from '../interfaces/conversion';
import * as moment from 'moment';

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
  conversionHistory: Array<any>;
  exchangeHistoryColumns: Array<string> = ['timestamp', 'rate'];
  historyDateRangeOptions: Array<any> = [{value: 7, label: '7 days'}, {value: 14, label: '14 days'}, {value: 30, label: '30 days'}];
  historyDateRangeSelected: number = 7;
  statistics: Array<any>;
  statisticsColumns: Array<string> = ['statistics', 'values'];

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
    this.convertService.convert(this.initialAmount, this.fromCurrency, this.toCurrency).subscribe(myObserver);
    this.loadConvertHistory();
  }

  loadConvertHistory() {
    let fromDate = moment().utc().subtract(this.historyDateRangeSelected, 'days').startOf('day').format();
    let toDate = moment().utc().startOf('day').format();

    this.convertService.exchangeHistory(this.fromCurrency, this.toCurrency, fromDate, toDate).subscribe(
      (conversionHistory) => {
        this.conversionHistory = conversionHistory;
        let rates = this.conversionHistory.map(conversion => conversion.rate);
        let max = Math.max.apply(Math, rates);
        let min = Math.min.apply(Math, rates);
        let average = rates.reduce((a, b) => a + b, 0) / (rates.length);
        this.statistics = [
          { label: 'Lowest', value: min },
          { label: 'Highest', value: max },
          { label: 'Average', value: average }
        ];
      }
    );
  }

}
