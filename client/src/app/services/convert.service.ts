import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service'

@Injectable({
  providedIn: 'root'
})
export class ConvertService {

  api:string = 'https://api.nomics.com/v1/exchange-rates?key=e180d3d7dcf22df397ef0d91b5de1869';

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  getCurrencies() {
    return this.http.get(this.api);
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

    let conversion = {
      fromCurrency: fromCurrency,
      toCurrency: toCurrency,
      rate: rate,
      inverseRate: (1 / rate),
      initialAmount: amount,
      finalAmount: (amount * rate),
      date: (new Date).toISOString()
    };

    let conversions = this.loadConversions();
    conversions.push(conversion);
    this.cookieService.set('conversions', JSON.stringify(conversions));

    return conversion;
  }

  loadConversions() {
    let conversions = this.cookieService.get('conversions');
    if (conversions.length > 0) return JSON.parse(conversions);
    return [];
  }
}