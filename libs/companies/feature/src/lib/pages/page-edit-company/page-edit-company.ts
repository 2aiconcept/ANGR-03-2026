import { ChangeDetectionStrategy, Component, inject, input, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CompaniesStore } from '@mini-crm/companies/data-access';
import { FormCompany } from '@mini-crm/companies/ui';
import { Company, CompanyPayload } from '@mini-crm/companies/util';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-page-edit-company',
  imports: [FormCompany],
  templateUrl: './page-edit-company.html',
  styleUrl: './page-edit-company.css',
})
export default class PageEditCompany implements OnInit {
  private readonly store = inject(CompaniesStore);
  private readonly router = inject(Router);

  /** Le :id de l'URL (/companies/edit/:id), fourni par withComponentInputBinding. C'est toujours une string. */
  readonly id = input.required<string>();

  /** L'entreprise à modifier, null tant qu'elle n'est pas chargée. */
  protected readonly company = signal<Company | null>(null);

  /** Message d'erreur du store (celui de l'API). */
  protected readonly error = this.store.error;

  /** Charge l'entreprise depuis l'API pour pré-remplir le formulaire. */
  async ngOnInit(): Promise<void> {
    this.company.set(await this.store.loadOne(Number(this.id())));
  }

  /** Enregistre les modifications puis revient à la liste si tout s'est bien passé. */
  protected async onSave(payload: CompanyPayload): Promise<void> {
    await this.store.update(Number(this.id()), payload);
    if (!this.store.error()) {
      this.router.navigate(['/companies']);
    }
  }
}
