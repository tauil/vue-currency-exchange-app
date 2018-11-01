import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  username: string;
  password: string;

  constructor(public authService: AuthService, private router: Router) { }

  ngOnInit() {
    console.log(this.authService.isAuthenticated());
    if (this.authService.isAuthenticated())
      this.router.navigate(['/convert']);
  }

  login() {
    if (this.authService.login(this.username, this.password))
      this.router.navigate(['/convert']);
  }

}
