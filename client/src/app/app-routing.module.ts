import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';
import { AuthComponent } from './auth/auth.component';
import { ConvertCurrencyComponent } from './convert-currency/convert-currency.component';

const routes: Routes = [
  {
    path: 'auth',
    component: AuthComponent,
    data: { title: 'Authenticate' }
  },
  {
    path: 'convert',
    component: ConvertCurrencyComponent,
    data: { title: 'Convert Currency' },
    canActivate: [AuthGuard]
  },
  { path: '',
    redirectTo: '/auth',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
