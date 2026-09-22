import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CompanyService } from '@mini-crm/companies/data-access';
import { Router } from '@angular/router';
import { TableCompany } from '@mini-crm/companies/ui';
import { ConfirmDialog } from '@mini-crm/shared/ui';
export type deleteItemPayload = {
  id: number;
  company: string;
};
@Component({
  selector: 'app-page-list-companies',
  imports: [TableCompany, ConfirmDialog],
  templateUrl: './page-list-companies.html',
  styleUrl: './page-list-companies.css',
})
export default class PageListCompanies implements OnInit {
  /** Injecter companyService pour pouvoir appeler les methodes du service */
  private readonly companyService = inject(CompanyService);

  /** Injecter le router pour faire la redirection vers la route edit/_id. */
  private readonly router = inject(Router);

  /** Signal pour la liste des companies depuis le service. */
  protected readonly companies = this.companyService.companies;

  /** Signal pour récupérer l'error depuis le service. */
  protected readonly error = this.companyService.error;

  /** Signal qui récupère l'id et le nom de la company à supprimer depuis table-company component */
  protected readonly pendingDeleteItem = signal<deleteItemPayload | null>(null);

  /** Signal calculé automatiquement avec le nom de la companie qui return le message à envoyer à la boite de dialog */
  protected readonly confirmMessage = computed(() => {
    const item = this.pendingDeleteItem();
    return item
      ? `Voulez-vous vraiment supprimer « ${item.company} » ? Cette action est irréversible.`
      : '';
  });

  ngOnInit(): void {
    /** charge la liste des companies à l'initialisation du component */
    this.companyService.load();
  }

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
    // console.log(item);
    /**  */
    this.pendingDeleteItem.set(item);
  }

  /** Confirmation : supprime réellement puis referme la modale. */
  protected confirmDelete(): void {
    const item = this.pendingDeleteItem();
    if (item !== null) {
      const id = item.id;
      this.companyService.remove(id);
    }
    this.pendingDeleteItem.set(null);
  }

  /** Annulation : referme la modale sans rien supprimer. */
  protected cancelDelete(): void {
    this.pendingDeleteItem.set(null);
  }
}
