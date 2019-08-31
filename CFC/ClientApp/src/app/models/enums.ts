export enum OfficeStatus {
  UNKNOWN = '0',
  ACTIVE = '1',
  CANCELED = '2',
  BLOCKED = '3'
}

export enum MoneyRecordType {
  EXPENSE = 1,
  INCOME = 2,
}

export const OfficeStatusLabelMapping: Record<OfficeStatus, string> = {
  [OfficeStatus.UNKNOWN]: 'UNKNOWN',
  [OfficeStatus.ACTIVE]: 'ACTIVE',
  [OfficeStatus.CANCELED]: 'CANCELED',
  [OfficeStatus.BLOCKED]: 'BLOCKED',
};
