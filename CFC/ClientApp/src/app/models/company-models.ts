import { CompanyUserRole } from './enums';

export class CompanyAddModel {
  name: string;
  identificationNumber: string;
}

export class CompanyOfficeAddModel {
  officeId: string;
  companyId: number;
  percentage: number;

}

export class OfficeAddModel {
  name: string;
  description: string;

}

export class EditCompanyModel {
  public companyId: string;
  public name: string;
  public identificationNumber: string;
  public registrationDate: any;
  public status: any;
}


export class CompanyOwnerAddModel {
  userId: string;
  companyId: number;
  percentage: number;
  role: CompanyUserRole;
}
