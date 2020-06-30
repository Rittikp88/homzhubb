import { ScheduleTypes } from '@homzhub/common/src/domain/models/LeaseTerms';

export interface ICreateSaleTermDetails {
  currency_code: string;
  expected_price: number;
  booking_amount: number;
  year_of_construction: number;
  available_from_date: string;
  maintenance_amount: number;
  maintenance_schedule: ScheduleTypes;
}

export interface IUpdateSaleTermDetails {
  currency_code?: string;
  expected_price?: number;
  booking_amount?: number;
  year_of_construction?: number;
  available_from_date?: string;
  maintenance_amount?: number;
  maintenance_schedule?: ScheduleTypes;
}

export interface ISaleDetails extends ICreateSaleTermDetails {
  id: number;
}
