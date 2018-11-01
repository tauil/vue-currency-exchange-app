import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service'

@Component({
  selector: 'app-conversion-history',
  templateUrl: './conversion-history.component.html',
  styleUrls: ['./conversion-history.component.scss']
})
export class ConversionHistoryComponent implements OnInit {

  conversions: Array<any>;

  constructor(, private cookieService: CookieService) { }

  ngOnInit() {
    this.loadHistory();
  }

  loadHistory() {
    let rawHistoryData = this.cookieService.get('conversions');
    this.conversions = (rawHistoryData.length > 0) ? JSON.parse(rawHistoryData) : [];
  }

}
