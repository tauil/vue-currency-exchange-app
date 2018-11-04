import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Conversion } from '../interfaces/conversion';

@Injectable({
  providedIn: 'root'
})
export class ConvertService {

  host:string = 'https://api.nomics.com';
  apiKey:string = 'e180d3d7dcf22df397ef0d91b5de1869';
  exchangeRateEndpoint:string = '/v1/exchange-rates';
  exchangeRatesHistoryEndpoint:string = '/v1/exchange-rates/history';

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  getCurrencies() {
    return this.http.get(this.host + this.exchangeRateEndpoint, { params: { key: this.apiKey } });
  }

  convert(amount, fromCurrency, toCurrency):Observable<any> {
    return new Observable((observer) => {
      this.getCurrencies().subscribe(
        (response: Array<any>) => {
          observer.next(this.processConversions(response, amount, fromCurrency, toCurrency));
        },
        (error) => {
          observer.error(error);
        }
      );
    });
  }

  processConversions(response: Array<any>, amount:number, fromCurrency:string, toCurrency:string) {
    let rate = response.filter((conversion) => (conversion["currency"] === fromCurrency))[0]["rate"];

    if (toCurrency !== 'USD') {
      let rate2 = response.filter((conversion) => (conversion["currency"] === toCurrency))[0]["rate"];
      rate = (rate * (1 / rate2));
    }

    let conversion: Conversion = {
      fromCurrency: fromCurrency,
      toCurrency: toCurrency,
      rate: rate,
      inverseRate: (1 / rate),
      initialAmount: amount,
      finalAmount: (amount * rate),
      date: (new Date).toISOString()
    };

    let conversions: Conversion[] = this.loadConversions();
    conversions.push(conversion);
    this.saveConversions(conversions);

    return conversion;
  }

  saveConversions(conversions) {
    this.cookieService.set('conversions', JSON.stringify(conversions));
  }

  loadConversions(): Conversion[] {
    let conversions = this.cookieService.get('conversions');
    if (conversions.length > 0) return JSON.parse(conversions);
    return [];
  }

  deleteConversion(conversion) {
    let conversions = this.loadConversions()
    conversions = conversions.filter((c) => c["date"] !== conversion["date"]);
    this.saveConversions(conversions);
  }

  exchangeHistory(fromCurrency, toCurrency, startDate, endDate) {
    return new Observable((observer) => {
      this.getRatesHistory(fromCurrency, startDate, endDate).subscribe(
        (response: Array<any>) => {
          if (toCurrency !== 'USD') {
            this.getRatesHistory(toCurrency, startDate, endDate).subscribe(
              (response2: Array<any>) => {
                observer.next(this.processRates(response, response2));
              },
              (error) => {
                observer.error(error);
              }
            )
          } else {
            observer.next(response.map(conversion => {
              return {
                timestamp: conversion["timestamp"],
                rate: parseFloat(conversion["rate"])
              }
            }));
          }
        },
        (error) => {
          observer.error(error);
        }
      );
    });
  }

  getRatesHistory(fromCurrency, startDate, endDate) {
    let params = new HttpParams();
    params = params.append('key', this.apiKey);
    params = params.append('currency', fromCurrency);
    params = params.append('start', startDate);
    params = params.append('end', endDate);
    return this.http.get(this.host + this.exchangeRatesHistoryEndpoint, { params: params });
  }

  private processRates(ratesFromCurrency: Array<any>, ratesToCurrency: Array<any>):Array<any> {
    return ratesFromCurrency.map((rateHistory) => {
      let rateSameTime = ratesToCurrency.filter(r => (r["timestamp"] === rateHistory["timestamp"]));

      return {
        timestamp: rateHistory["timestamp"],
        rate: (parseFloat(rateHistory["rate"]) * (1 / parseFloat(rateSameTime[0]["rate"])))
      }
    });
  }
}
