import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  users: Array<any> = [
    { "username": "user1", "password": "pass1", "fullName": "John Doe" },
    { "username": "user2", "password": "pass2", "fullName": "Adam Smith" }
  ];

  constructor() { }

  login(username, password) {
    let user = this.users.filter((item) => {
      return item["username"] == username;
    });

    if ((user.length > 0) && (user[0]["password"] == password)) {
      localStorage.setItem('user', user[0]["username"]);
      return true;
    } else {
      return false;
    }
  }

  isAuthenticated() {
    let authenticated = localStorage.getItem('user');
    return !!authenticated;
  }
}
