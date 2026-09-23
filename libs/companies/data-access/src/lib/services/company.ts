import { inject, Injectable, signal } from '@angular/core';
import { Company, CompanyPayload } from '@mini-crm/companies/util';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '@mini-crm/shared/data-access';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  // inject HttpClient from angular
  private readonly http = inject(HttpClient);

  // URL de l'API pour les entreprises, dérivée de l'URL de base fournie par l'app.
  private readonly companiesUrl = `${inject(API_URL)}/entreprises`;

  // signals to expose as read only collection companies
  // État de la liste, exposé en lecture seule aux composants.
  private readonly companiesSignal = signal<Company[]>([]);
  readonly companies = this.companiesSignal.asReadonly();

  // Message d'erreur éventuel, à afficher dans l'UI.
  private readonly errorSignal = signal<string | null>(null);
  readonly error = this.errorSignal.asReadonly();

  /** Charge la liste des entreprises depuis l'API et alimente le signal. Renvoie l'Observable pour le resolver. */
  load(): Observable<Company[]> {
    this.errorSignal.set(null);
    return this.http.get<Company[]>(this.companiesUrl).pipe(
      tap((companies) => this.companiesSignal.set(companies)),
    );
  }

  // load(): void {
  //   this.http.get<Company[]>(this.companiesUrl).subscribe({
  //     next: (companies) => this.companiesSignal.set(companies),
  //     error: () => this.errorSignal.set('Impossible de charger les entreprises'),
  //   });
  // }

  // function to get one company with id using HttpClient
  // function to add company using HttpClient
  /** Crée une entreprise. */
  create(payload: CompanyPayload): Observable<Company> {
    return this.http.post<Company>(this.companiesUrl, payload);
  }

  // function to delete company using HttpClient
  /** Supprime une entreprise puis retire la ligne de la liste locale. */
  remove(id: number): void {
    this.errorSignal.set(null);
    this.http.delete<void>(`${this.companiesUrl}/${id}`).subscribe({
      next: () =>
        this.companiesSignal.update((list) => list.filter((company) => company.id !== id)),
      error: () => this.errorSignal.set("Impossible de supprimer l'entreprise."),
    });
  }

  // function to update a company using HttpClient
}
