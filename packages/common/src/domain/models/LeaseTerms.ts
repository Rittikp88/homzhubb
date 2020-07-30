import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';

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
  annual_increment_percentage?: number | null;
  minimum_lease_period?: number;
  furnishing_status?: FurnishingType;
  available_from_date?: string;
  maintenance_paid_by?: PaidByTypes;
  utility_paid_by?: PaidByTypes;
  maintenance_amount?: number | null;
  maintenance_schedule?: ScheduleTypes | null;
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

@JsonObject('LeaseTerms')
export class LeaseTerms {
  // TODO: Ask the backend team to send an empty object for Lease Term in case of Sale terms data
  @JsonProperty('id', Number, true)
  private _id = '';

  @JsonProperty('available_from_date', String, true)
  private _availableFromDate = '';

  @JsonProperty('maintenance_paid_by', String, true)
  private _maintenancePaidBy = '';

  @JsonProperty('utility_paid_by', String, true)
  private _utilityPaidBy = '';

  @JsonProperty('monthly_rent_price', Number, true)
  private _monthlyRentPrice = 0;

  @JsonProperty('maintenance_schedule', String, true)
  private _maintenanceSchedule = '';

  get id(): string {
    return this._id;
  }

  get availableFromDate(): string {
    return this._availableFromDate;
  }

  get maintenancePaidBy(): string {
    return this._maintenancePaidBy;
  }

  get utilityPaidBy(): string {
    return this._utilityPaidBy;
  }

  get monthlyRentPrice(): number {
    return this._monthlyRentPrice;
  }

  get maintenanceSchedule(): string {
    return this._maintenanceSchedule;
  }
}
