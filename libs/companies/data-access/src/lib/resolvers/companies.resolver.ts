import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { CompaniesStore } from '../store/companies.store';

/** Remplit le store avant d'afficher la liste : le routeur attend la fin de load(). */
export const companiesResolver: ResolveFn<void> = () => inject(CompaniesStore).load();
