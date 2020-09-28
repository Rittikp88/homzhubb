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

interface ISpaces {
  space_type: number;
  count: number;
}

export interface IUpdateLeaseTermDetails {
  currency_code?: string;
  expected_monthly_rent?: number;
  security_deposit?: number;
  annual_rent_increment_percentage?: number | null;
  minimum_lease_period?: number;
  furnishing?: FurnishingType;
  available_from_date?: string;
  maintenance_paid_by?: PaidByTypes;
  utility_paid_by?: PaidByTypes;
  maintenance_amount?: number | null;
  maintenance_payment_schedule?: ScheduleTypes | null;
  description?: string;
  tenant_preferences?: number[];
  lease_unit?: {
    name: string;
    spaces: ISpaces[];
  };
}

export interface ICreateLeaseTermDetails {
  currency_code?: string;
  expected_monthly_rent: number;
  security_deposit: number;
  annual_rent_increment_percentage: number | null;
  minimum_lease_period: number;
  furnishing: FurnishingType;
  available_from_date: string;
  maintenance_paid_by: PaidByTypes;
  utility_paid_by: PaidByTypes;
  maintenance_amount: number | null;
  maintenance_payment_schedule: ScheduleTypes | null;
  description?: string;
  tenant_preferences?: number[];
  lease_unit: {
    name: string;
    spaces: ISpaces[];
  };
}

export interface ILeaseTermDetails extends ICreateLeaseTermDetails {
  id: number;
}

@JsonObject('LeaseTerms')
export class LeaseTerms {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('status', String)
  private _status = '';

  @JsonProperty('expected_monthly_rent', Number)
  private _expectedPrice = 0;

  @JsonProperty('security_deposit', Number)
  private _securityDeposit = 0;

  @JsonProperty('minimum_lease_period', Number)
  private _minimumLeasePeriod = 0;

  @JsonProperty('annual_rent_increment_percentage', Number, true)
  private _annualRentIncrementPercentage: number | null = null;

  @JsonProperty('available_from_date', String)
  private _availableFromDate = '';

  @JsonProperty('maintenance_paid_by', String)
  private _maintenancePaidBy = '';

  @JsonProperty('utility_paid_by', String)
  private _utilityPaidBy = '';

  @JsonProperty('maintenance_amount', Number, true)
  private _maintenanceAmount: number | null = null;

  @JsonProperty('maintenance_payment_schedule', String, true)
  private _maintenanceSchedule: string | null = null;

  @JsonProperty('furnishing', String)
  private _furnishing = '';

  @JsonProperty('currency_code', String)
  private _currencyCode = 'INR';

  @JsonProperty('currency_symbol', String)
  private _currencySymbol = '';

  @JsonProperty('description', String)
  private _description = '';

  get id(): number {
    return this._id;
  }

  get status(): string {
    return this._status;
  }

  get expectedPrice(): number {
    return this._expectedPrice;
  }

  get securityDeposit(): number {
    return this._securityDeposit;
  }

  get minimumLeasePeriod(): number {
    return this._minimumLeasePeriod;
  }

  get annualRentIncrementPercentage(): number | null {
    return this._annualRentIncrementPercentage;
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

  get maintenanceAmount(): number | null {
    return this._maintenanceAmount;
  }

  get maintenanceSchedule(): string | null {
    return this._maintenanceSchedule;
  }

  get furnishing(): string {
    return this._furnishing;
  }

  get currencyCode(): string {
    return this._currencyCode;
  }

  get currencySymbol(): string {
    return this._currencySymbol;
  }

  get description(): string {
    return this._description;
  }
}
