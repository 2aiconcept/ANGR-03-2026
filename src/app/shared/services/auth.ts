import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Auth {

  // isAuthenticated property
  isAuthenticated = false;

  login() {
    this.isAuthenticated = true;
  }

  logout( ) {
    this.isAuthenticated = false
  }
}
