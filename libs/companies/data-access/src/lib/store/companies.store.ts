import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import {
  addEntity,
  removeEntity,
  setAllEntities,
  updateEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { API_URL } from '@mini-crm/shared/data-access';
import { Company, CompanyPayload } from '@mini-crm/companies/util';

type CompaniesState = {
  isLoading: boolean;
  error: string | null;
};

const initialState: CompaniesState = {
  isLoading: false,
  error: null,
};

export const CompaniesStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  // withEntities fournit la liste des entreprises : store.entities()
  withEntities<Company>(),
  withMethods((store, http = inject(HttpClient), apiUrl = `${inject(API_URL)}/entreprises`) => ({
    async load(): Promise<void> {
      patchState(store, { isLoading: true, error: null });
      try {
        const companies = await firstValueFrom(http.get<Company[]>(apiUrl));
        patchState(store, setAllEntities(companies), { isLoading: false });
      } catch {
        patchState(store, { error: 'Impossible de charger les entreprises.', isLoading: false });
      }
    },
    async loadOne(id: number): Promise<Company | null> {
      patchState(store, { isLoading: true, error: null });
      try {
        const company = await firstValueFrom(http.get<Company>(`${apiUrl}/${id}`));
        patchState(store, { isLoading: false });
        return company;
      } catch {
        patchState(store, { error: "Impossible de charger l'entreprise.", isLoading: false });
        return null;
      }
    },
    async update(id: number, payload: CompanyPayload): Promise<void> {
      patchState(store, { isLoading: true, error: null });
      try {
        const updated = await firstValueFrom(http.put<Company>(`${apiUrl}/${id}`, payload));
        patchState(store, updateEntity({ id, changes: updated }), { isLoading: false });
      } catch {
        patchState(store, { error: "Impossible de modifier l'entreprise.", isLoading: false });
      }
    },
    async add(payload: CompanyPayload): Promise<void> {
      patchState(store, { isLoading: true, error: null });
      try {
        const created = await firstValueFrom(http.post<Company>(apiUrl, payload));
        patchState(store, addEntity(created), { isLoading: false });
      } catch {
        patchState(store, { error: "Impossible de créer l'entreprise.", isLoading: false });
      }
    },
    async remove(id: number): Promise<void> {
      patchState(store, { error: null });
      try {
        await firstValueFrom(http.delete<void>(`${apiUrl}/${id}`));
        patchState(store, removeEntity(id));
      } catch {
        patchState(store, { error: "Impossible de supprimer l'entreprise." });
      }
    },
  })),
);
