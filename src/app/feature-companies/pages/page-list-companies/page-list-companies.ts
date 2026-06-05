import { Component, inject } from '@angular/core';
import { CompanyService } from '../../services/company';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-list-companies',
  imports: [],
  templateUrl: './page-list-companies.html',
  styleUrl: './page-list-companies.css',
})
export default class PageListCompanies {
  // INJECT COMPANY SERVICE
  private readonly companyService = inject(CompanyService);

  // INJECT ROUTER
  private readonly router = inject(Router);

  // SIGNAL FOR COMPANIES COLLECTION
  protected readonly companies = this.companyService.companies;
  // SIGNAL FOR API ERRORS
  protected readonly error = this.companyService.error;

  // SIGNAL  COMPUTED TO PASS COMPANY NAME TO DIALOG BOX WITH PERSONNAL MESSAGE

  // METHOD TO REDIRECT TO ADD

  // METHOD TO OPEN DIALOG BOX

  // MMETHOD TO DELELE AFTER CONFIRM DELETE IN DIALOG BOX

  // METHOD TO CANCEL A DELETE AFTER DIALOG BOX
}
