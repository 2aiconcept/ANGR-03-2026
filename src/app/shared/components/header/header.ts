import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  // propriete auth = inject du servce pour pouvoir utiliser auth.isAuthenticated du service dan le html

  // protected logout() pour déconnexion via une methode du service

}
