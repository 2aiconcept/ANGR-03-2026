import { inject, Injectable, signal } from '@angular/core';
import { Company } from '../models/company';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {

  // inject HttpClient from angular
  private readonly http = inject(HttpClient);

  // signals to expose as read only collection companies
  // État de la liste, exposé en lecture seule aux composants.
  private readonly companiesSignal = signal<Company[]>([]);
  readonly companies = this.companiesSignal.asReadonly();

  // Message d'erreur éventuel, à afficher dans l'UI.
  private readonly errorSignal = signal<string | null>(null);
  readonly error = this.errorSignal.asReadonly();


  /** Charge la liste des entreprises depuis l'API et alimente le signal. */
  load(): void {
    // remmetre à null le signal errorSignal
    this.errorSignal.set(null);
    // call api
    this.http.get<Company[]>('https://mini-crm-api-production-298d.up.railway.app/api/entreprises').subscribe({
      next : (companies) => this.companiesSignal.set(companies),
      error: () => this.errorSignal.set("Impossible de charger les entreprises")
    })
  }

  // function to get one company with id using HttpClient

  // function to add company using HttpClient

  // function to delete company using HttpClient

  // function to update a company using HttpClient
}
