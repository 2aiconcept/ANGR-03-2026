import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CompaniesStore } from '@mini-crm/companies/data-access';
import { Router } from '@angular/router';
import { TableCompany } from '@mini-crm/companies/ui';
import { ConfirmDialog } from '@mini-crm/shared/ui';
export type deleteItemPayload = {
  id: number;
  company: string;
};
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-page-list-companies',
  imports: [TableCompany, ConfirmDialog],
  templateUrl: './page-list-companies.html',
  styleUrl: './page-list-companies.css',
})
export default class PageListCompanies {
  /** Le store des entreprises (déjà rempli par le resolver avant l'affichage de la page). */
  private readonly store = inject(CompaniesStore);

  /** Injecter le router pour faire la redirection vers la route edit/_id. */
  private readonly router = inject(Router);

  /** Signal pour la liste des companies depuis le store. */
  protected readonly companies = this.store.entities;

  /** Signal pour récupérer l'error depuis le store. */
  protected readonly error = this.store.error;

  /** Signal qui récupère l'id et le nom de la company à supprimer depuis table-company component */
  protected readonly pendingDeleteItem = signal<deleteItemPayload | null>(null);

  /** Signal calculé automatiquement avec le nom de la companie qui return le message à envoyer à la boite de dialog */
  protected readonly confirmMessage = computed(() => {
    const item = this.pendingDeleteItem();
    return item
      ? `Voulez-vous vraiment supprimer « ${item.company} » ? Cette action est irréversible.`
      : '';
  });

  /** Redirige vers le formulaire d'ajout d'une entreprise. */
  protected onAddCompany(): void {
    this.router.navigate(['/companies/add']);
  }

  /** Redirige vers le formulaire d'edition d'une entreprise avec id dans la route. */
  protected editItem(id: number) {
    this.router.navigate(['/companies/edit', id]);
  }

  /** Récupère le nom et l'id de l'item à supprimer avant suppressions definitive */
  protected onDeleteRequest(item: deleteItemPayload): void {
    this.pendingDeleteItem.set(item);
  }

  /** Confirmation : supprime réellement puis referme la modale. */
  protected confirmDelete(): void {
    const item = this.pendingDeleteItem();
    if (item !== null) {
      this.store.remove(item.id);
    }
    this.pendingDeleteItem.set(null);
  }

  /** Annulation : referme la modale sans rien supprimer. */
  protected cancelDelete(): void {
    this.pendingDeleteItem.set(null);
  }
}
