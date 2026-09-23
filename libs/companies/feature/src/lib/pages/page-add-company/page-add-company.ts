import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CompaniesStore } from '@mini-crm/companies/data-access';
import { Router } from '@angular/router';
import { CompanyPayload } from '@mini-crm/companies/util';
import { FormCompany } from '@mini-crm/companies/ui';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-page-add-company',
  imports: [FormCompany],
  templateUrl: './page-add-company.html',
  styleUrl: './page-add-company.css',
})
export default class PageAddCompany {
  private readonly store = inject(CompaniesStore);
  private readonly router = inject(Router);

  /** Message d'erreur du store (celui de l'API), affiché au-dessus du formulaire. */
  protected readonly error = this.store.error;

  /** Reçoit les données valides du formulaire,
   * crée l'entreprise puis revient à la liste si tout s'est bien passé. */
  protected async onSave(payload: CompanyPayload): Promise<void> {
    await this.store.add(payload);
    if (!this.store.error()) {
      this.router.navigate(['/companies']);
    }
  }
}
