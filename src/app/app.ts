import { Component, inject, signal } from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';
import { ShoppingListStore } from './app-store';
import { ArticleForm } from './types';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';

@Component({
  selector: 'app-root',
  imports: [
    FormField,
    MatFormFieldModule,
    MatInputModule,
    MatLabel,
    MatButtonModule,
    MatListModule,
    MatIconModule,
  ],
  styleUrl: './app-styles.scss', // FormRoot könnte die Submission-Lösung sein
  template: `
    <header>
      <h1>EDeHS</h1>
      <h2>Welcome, scatterbrain!</h2>
      <p>Let's do some goddamn shopping.</p>
    </header>
    <main>
      <section id="input">
        <h3>Neuen Artikel hinzufügen</h3>
        <div class="input">
          <form>
            <mat-form-field>
              <mat-label>Neuer Artikel</mat-label>
              <input matInput type="text" [formField]="articleForm.name" />
            </mat-form-field>
            <mat-form-field>
              <mat-label>Menge</mat-label>
              <input matInput type="text" [formField]="articleForm.amount" />
            </mat-form-field>
            <br />
            <button matButton="outlined" type="submit" (click)="store.addArticle(formValues())">
              Hinzufügen
            </button>
          </form>
        </div>
      </section>
      <section id="einkaufsliste">
        <h3>Einkaufsliste</h3>
        <mat-list role="list">
          @for (article of store.articles(); track article.id) {
            @if (article.isDone === false) {
              <mat-list-item role="listitem">
                <div class="container">
                  <button
                    matIconButton
                    aria-label="Gekauft"
                    (click)="store.updateArticle(article.id, formValues())"
                  >
                    <mat-icon>done outline</mat-icon>
                  </button>
                  {{ article.name + ', ' + article.amount }}
                  <button
                    matIconButton
                    aria-label="Artikel löschen"
                    (click)="store.updateArticle(article.id, formValues())"
                  >
                    <mat-icon>delete_forever</mat-icon>
                  </button>
                </div>
              </mat-list-item>
            }
          }
        </mat-list>
        <h3>Vorschläge</h3>
        <mat-list role="list">
          @for (article of store.articles(); track article.id) {
            @if (article.isDone === true) {
              <mat-list-item role="listitem">
                <div class="container">
                  <button
                    matIconButton
                    aria-label="Zur Einkaufsliste hinzufügen"
                    (click)="store.updateArticle(article.id, formValues())"
                  >
                    <mat-icon>playlist_add</mat-icon>
                  </button>
                  {{ article.name + ', ' + article.amount }}
                  <button
                    matIconButton
                    aria-label="Artikel löschen"
                    (click)="store.updateArticle(article.id, formValues())"
                  >
                    <mat-icon>delete_forever</mat-icon>
                  </button>
                </div>
              </mat-list-item>
            }
          }
        </mat-list>
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
