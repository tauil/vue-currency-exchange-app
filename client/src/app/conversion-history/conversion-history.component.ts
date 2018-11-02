import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service'
import { ConvertService } from '../services/convert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-conversion-history',
  templateUrl: './conversion-history.component.html',
  styleUrls: ['./conversion-history.component.scss']
})
export class ConversionHistoryComponent implements OnInit {

  conversions: Array<any>;
  displayedColumns: string[] = ['date', 'event', 'actions'];

  constructor(private cookieService: CookieService, private router: Router, public convertService: ConvertService) { }

  ngOnInit() {
    this.loadHistory();
  }

  viewConversion(conversion) {
    this.router.navigate(['/convert'], {queryParams: {amount: conversion.initialAmount, from: conversion.fromCurrency, to: conversion.toCurrency}});
  }

  deleteConversion(conversion) {
    this.convertService.deleteConversion(conversion);
    this.loadHistory();
  }

  loadHistory() {
    let rawHistoryData = this.cookieService.get('conversions');
    this.conversions = (rawHistoryData.length > 0) ? JSON.parse(rawHistoryData) : [];
  }

}
