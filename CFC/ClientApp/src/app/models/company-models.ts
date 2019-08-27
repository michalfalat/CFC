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
