import { inject, Injectable, signal } from '@angular/core';
import { Company, CompanyPayload } from '../models/company';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

const API_URL = `${environment.apiBaseUrl}/entreprises`;
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
    this.http.get<Company[]>(API_URL).subscribe({
      next : (companies) => this.companiesSignal.set(companies),
      error: () => this.errorSignal.set("Impossible de charger les entreprises")
    })
  }

  // function to get one company with id using HttpClient

  // function to add company using HttpClient
  /** Crée une entreprise. */
  create(payload: CompanyPayload): Observable<Company> {
    return this.http.post<Company>(API_URL, payload);
  }

  // function to delete company using HttpClient
  /** Supprime une entreprise puis retire la ligne de la liste locale. */
  remove(id: number): void {
    this.errorSignal.set(null);
    this.http.delete<void>(`${API_URL}/${id}`).subscribe({
      next: () => this.companiesSignal.update((list) => list.filter((company) => company.id !== id)),
      error: () => this.errorSignal.set("Impossible de supprimer l'entreprise."),
    });
  }

  // function to update a company using HttpClient
}
