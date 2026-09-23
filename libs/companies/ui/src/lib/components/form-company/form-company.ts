import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { CompanyPayload } from '@mini-crm/companies/util';
import { form, FormField, minLength, required } from '@angular/forms/signals';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-form-company',
  imports: [FormField, TranslocoPipe],
  templateUrl: './form-company.html',
  styleUrl: './form-company.css',
})
export class FormCompany {

  /** Valeurs initiales : vides pour l'ajout, pré-remplies pour l'édition (réutilisable). */
  readonly initialValue = input<CompanyPayload>({ nom: '', secteur: '', adresse: '', telephone: '' });

  /** Clé de traduction du bouton de soumission (ex. « Ajouter » ou « Enregistrer »). */
  readonly submitLabel = input('companies.form.submit');

  /** Émis avec les données valides à la soumission ; le parent décide quoi en faire. */
  readonly save = output<CompanyPayload>();

    /** Données saisies, pilotées par le signal form. */
  private readonly model = signal<CompanyPayload>({ nom: '', secteur: '', adresse: '', telephone: '' });

  /** Signal form : valeur + validation déclarative. Les messages sont des clés, traduites dans le template. */
  protected readonly companyForm = form(this.model, (path) => {
    required(path.nom, { message: 'companies.form.errors.nomRequired' });
    required(path.secteur, { message: 'companies.form.errors.secteurRequired' });
    required(path.adresse, { message: 'companies.form.errors.adresseRequired' });
    required(path.telephone, { message: 'companies.form.errors.telephoneRequired' });
  });

  ngOnInit(): void {
    // Recopie les valeurs initiales dans le formulaire.
    // Sans effet en ajout (valeurs vides), utile en édition (valeurs pré-remplies).
    this.model.set({ ...this.initialValue() });
  }

  protected onSubmit(event: Event): void {
    event.preventDefault();
    if (this.companyForm().invalid()) {
      return;
    }
    this.save.emit(this.model());
  }
}
