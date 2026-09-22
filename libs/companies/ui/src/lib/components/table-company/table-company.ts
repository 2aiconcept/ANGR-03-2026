import { Component, input, output } from '@angular/core';
import { Company } from '@mini-crm/companies/util';
export type deleteItemPayload = {
  id: number;
  company: string;
};
@Component({
  selector: 'app-table-company',
  imports: [],
  templateUrl: './table-company.html',
  styleUrl: './table-company.css',
})
export class TableCompany {
  /** Liste à afficher, fournie par le composant parent (la page). */
  readonly companies = input.required<Company[]>();

  /** Émis quand l'utilisateur veut éditer une entreprise (transporte l'id). */
  readonly editCompany = output<number>();

  /** Émis quand l'utilisateur veut supprimer une entreprise (transporte l'id). */
  // readonly deleteCompany = output<number>()
  readonly deleteCompany = output<deleteItemPayload>();

  ngOnInit() {
    console.log(this.companies());
  }
}
