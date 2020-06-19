export enum PaidByTypes {
  TENANT = 'TENANT',
  OWNER = 'OWNER',
}

export enum ScheduleTypes {
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  ANNUALLY = 'ANNUALLY',
}

export enum FurnishingType {
  SEMI = 'SEMI',
  NONE = 'NONE',
  FULL = 'FULL',
}

export interface IUpdateLeaseTermDetails {
  currency_code?: string;
  monthly_rent_price?: number;
  security_deposit_price?: number;
  annual_increment_percentage?: number;
  minimum_lease_period?: number;
  furnishing_status?: FurnishingType;
  available_from_date?: string;
  maintenance_paid_by?: PaidByTypes;
  utility_paid_by?: PaidByTypes;
  maintenance_amount?: number;
  maintenance_schedule?: ScheduleTypes;
}

export interface ICreateLeaseTermDetails {
  currency_code: string;
  monthly_rent_price: number;
  security_deposit_price: number;
  annual_increment_percentage: number | null;
  minimum_lease_period: number;
  furnishing_status: FurnishingType;
  available_from_date: string;
  maintenance_paid_by: PaidByTypes;
  utility_paid_by: PaidByTypes;
  maintenance_amount: number | null;
  maintenance_schedule: ScheduleTypes | null;
}

export interface ILeaseTermDetails extends ICreateLeaseTermDetails {
  id: number;
}
