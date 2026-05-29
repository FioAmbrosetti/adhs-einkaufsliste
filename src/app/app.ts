import { Component, inject, signal } from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';
import { ShoppingListStore } from './app-store';
import { ArticleForm } from './types';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';

@Component({
  selector: 'app-root',
  imports: [FormField, MatFormFieldModule, MatInputModule, MatLabel, MatButtonModule],
  styleUrl: './app-styles.scss', // FormRoot könnte die Submission-Lösung sein
  template: `
    <header>
      <h1>EDeHS</h1>
      <h2>Welcome, scatterbrain!</h2>
      <p>Let's do some goddamn shopping.</p>
    </header>
    <main>
      <section id="eingabe">
        <h3>Neuen Artikel hinzufügen</h3>
        <form>
          <mat-form-field>
            <mat-label>Neuer Artikel</mat-label>
            <input matInput type="text" [formField]="articleForm.name" />
          </mat-form-field>
          <br />
          <mat-form-field>
            <mat-label>Menge</mat-label>
            <input matInput type="text" [formField]="articleForm.amount" />
          </mat-form-field>
          <br />
          <button matButton="outlined" type="submit" (click)="store.addArticle(formValues())">
            Hinzufügen
          </button>
        </form>
      </section>
      <section id="einkaufsliste">
        <h3>Einkaufsliste</h3>
        <ul>
          @for (article of store.articles(); track article.id) {
            @if (article.isDone === false) {
              <li>
                {{ article.name + ', ' + article.amount }}
                <span
                  ><button (click)="store.updateArticle(article.id, formValues())">&#10003;</button>
                  <button (click)="store.removeArticle(article.id)">❌</button></span
                >
              </li>
            }
          }
        </ul>
        <h3>Vorschläge</h3>
        <ul>
          @for (article of store.articles(); track article.id) {
            @if (article.isDone === true) {
              <li>
                {{ article.name + ', ' + article.amount }}
                <span
                  ><button (click)="store.updateArticle(article.id, formValues())">&#10003;</button>
                  <button (click)="store.removeArticle(article.id)">❌</button></span
                >
              </li>
            }
          }
        </ul>
      </section>
    </main>
  `,
})
export class App {
  // Instanz des SignalStores, auf den zugegriffen werden soll
  store = inject(ShoppingListStore);

  formValues = signal<ArticleForm>({ name: '', amount: '', isDone: false });

  // Form-Objekt, schemaPath gibt Validation-Regeln an
  articleForm = form(this.formValues, (schemaPath) => {
    required(schemaPath.name, {
      message: 'Na, also wenigstens ein Stichwort solltest du schon schreiben.',
    });
  });
}
