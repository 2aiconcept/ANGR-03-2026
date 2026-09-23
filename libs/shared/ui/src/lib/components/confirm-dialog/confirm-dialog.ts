import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  input,
  output,
  viewChild,
} from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-confirm-dialog',
  imports: [TranslocoPipe],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialog {
  /** Ouvre (true) ou ferme (false) la boîte de dialogue. */
  readonly open = input.required<boolean>();

  /** Clés de traduction des textes affichés, personnalisables par la feature appelante. */
  readonly title = input('confirmDialog.title');
  readonly cancelLabel = input('confirmDialog.cancel');
  readonly confirmLabel = input('confirmDialog.confirm');

  /** Message déjà traduit par le parent (il contient souvent une valeur, comme un nom). */
  readonly message = input('');

  /** Événements émis vers le parent : action confirmée ou annulée. */
  readonly confirmed = output<void>();
  readonly cancelled = output<void>();

  // Référence à l'élément <dialog> natif pour piloter son ouverture modale.
  private readonly dialog = viewChild<ElementRef<HTMLDialogElement>>('dialog');

  constructor() {
    // Synchronise l'état natif du <dialog> avec l'input `open`.
    effect(() => {
      const element = this.dialog()?.nativeElement;
      if (!element) {
        return;
      }
      if (this.open()) {
        if (!element.open) {
          element.showModal(); // ouverture MODALE : focus piégé, backdrop, Échap
        }
      } else if (element.open) {
        element.close();
      }
    });
  }
}
