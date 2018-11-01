import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule, MatCardModule, MatInputModule, MatButtonModule, MatIconModule } from '@angular/material';

import { AppRoutingModule } from './app-routing.module';
import { CookieService } from 'ngx-cookie-service'

import { AuthService } from './services/auth.service';
import { ConvertService } from './services/convert.service';

import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { ConvertCurrencyComponent } from './convert-currency/convert-currency.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    ConvertCurrencyComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MatToolbarModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  providers: [AuthService, ConvertService, CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
