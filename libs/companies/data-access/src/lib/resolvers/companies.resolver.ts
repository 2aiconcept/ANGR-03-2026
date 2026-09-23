import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Company } from '@mini-crm/companies/util';
import { CompanyService } from '../services/company';

// export const companiesResolver: ResolveFn<Company[]> = () => inject(CompanyService).load();

// export const companiesResolver: ResolveFn<Company[]> = () => {
//   // const companyService = inject(CompanyService);
//   // companyService.load();
//   // return companyService.companies();
//   return inject(CompanyService).load()
// };


export const companiesResolver: ResolveFn<Company[]> = () =>  inject(CompanyService).load();