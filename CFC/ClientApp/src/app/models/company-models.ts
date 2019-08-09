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
  name: string;
  description: string;

}
