export class CompanyAddModel {
  name: string;
  identificationNumber: string;
}

export class CompanyOwnerAddModel {
  userId: string;
  companyId: number;
  percentage: number;

}

export class OfficeAddModel {
  companyId: number;
  name: string;
  description: string;

}
