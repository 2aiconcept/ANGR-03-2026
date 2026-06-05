import { Component, inject, OnInit } from '@angular/core';
import { CompanyService } from '../../services/company';
import { Router } from '@angular/router';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-page-list-companies',
  imports: [JsonPipe],
  templateUrl: './page-list-companies.html',
  styleUrl: './page-list-companies.css',
})
export default class PageListCompanies implements OnInit {
  // INJECT COMPANY SERVICE
  private readonly companyService = inject(CompanyService);

  // INJECT ROUTER
  private readonly router = inject(Router);

  // SIGNAL FOR COMPANIES COLLECTION
  protected readonly companies = this.companyService.companies;
  // SIGNAL FOR API ERRORS
  protected readonly error = this.companyService.error;

  ngOnInit(): void {
    this.companyService.load();
    console.log(this.companies())
  }


  // SIGNAL  COMPUTED TO PASS COMPANY NAME TO DIALOG BOX WITH PERSONNAL MESSAGE

  // METHOD TO REDIRECT TO ADD
  /** Redirige vers le formulaire d'ajout d'une entreprise. */
  protected onAddCompany(): void {
    this.router.navigate(['/add-company']);
  }

  // METHOD TO OPEN DIALOG BOX

  // MMETHOD TO DELELE AFTER CONFIRM DELETE IN DIALOG BOX

  // METHOD TO CANCEL A DELETE AFTER DIALOG BOX
}
