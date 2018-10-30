import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConvertService {

  api:string = 'https://api.nomics.com/v1/exchange-rates?key=e180d3d7dcf22df397ef0d91b5de1869';

  constructor(private http: HttpClient) { }

  getCurrencies() {
    return this.http.get(this.api);
  }

  convert(amount, fromCurrency):Observable<any> {
    return new Observable((observer) => {
      this.getCurrencies().subscribe(
        (response) => {
          let rate = response.filter((conversion) => (conversion["currency"] === fromCurrency))[0]["rate"];

          observer.next({
            rate: rate,
            inverseRate: (1 / rate),
            finalAmount: (amount * rate)
          });
        },
        (error) => {
          observer.error(error);
        }
      );
    });
  }
}
