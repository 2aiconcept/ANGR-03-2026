import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Auth {

  // isAuthenticated property
  isAuthenticated = false;

  signin() {
    // this.isAuthenticated = true;
  }

  signup() {
    // this.isAuthenticated = true;
  }

  logout( ) {
    this.isAuthenticated = false
  }
}
