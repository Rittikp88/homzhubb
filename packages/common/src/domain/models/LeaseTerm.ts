import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { Unit } from '@homzhub/common/src/domain/models/Unit';
import { FurnishingTypes, PaidByTypes, ScheduleTypes } from '@homzhub/common/src/constants/Terms';

export interface IUpdateLeaseTermParams {
  expected_monthly_rent?: number;
  security_deposit?: number;
  minimum_lease_period?: number;
  maximum_lease_period?: number;
  rent_free_period?: number | null;
  tenant_preferences?: number[];
  annual_rent_increment_percentage?: number | null;
  furnishing?: FurnishingTypes;
  available_from_date?: string;
  utility_paid_by?: PaidByTypes;
  maintenance_paid_by?: PaidByTypes;
  maintenance_amount?: number;
  maintenance_unit?: number;
  maintenance_payment_schedule?: ScheduleTypes | null;
  description?: string;
  lease_unit?: any;
}

export interface ICreateLeaseTermParams {
  expected_monthly_rent: number;
  security_deposit: number;
  annual_rent_increment_percentage: number | null;
  minimum_lease_period: number;
  maximum_lease_period: number;
  furnishing: FurnishingTypes;
  available_from_date: string;
  utility_paid_by: PaidByTypes;
  maintenance_paid_by: PaidByTypes;
  maintenance_amount: number | null;
  maintenance_unit?: number;
  maintenance_payment_schedule?: ScheduleTypes | null;
  description?: string;
  tenant_preferences?: number[];
  rent_free_period?: number;
  lease_unit: any;
}

@JsonObject('LeaseTerm')
export class LeaseTerm {
  @JsonProperty('id', Number)
  private _id = -1;

  @JsonProperty('expected_monthly_rent', Number)
  private _expectedPrice = -1;

  @JsonProperty('security_deposit', Number)
  private _securityDeposit = -1;

  @JsonProperty('minimum_lease_period', Number)
  private _minimumLeasePeriod = -1;

  @JsonProperty('maximum_lease_period', Number)
  private _maximumLeasePeriod = -1;

  @JsonProperty('rent_free_period', Number)
  private _rentFreePeriod = -1;

  @JsonProperty('annual_rent_increment_percentage', Number, true)
  private _annualRentIncrementPercentage = -1;

  @JsonProperty('available_from_date', String)
  private _availableFromDate = '';

  @JsonProperty('maintenance_paid_by', String)
  private _maintenancePaidBy = PaidByTypes.OWNER;

  @JsonProperty('maintenance_unit', Unit)
  private _maintenanceUnit = new Unit();

  @JsonProperty('maintenance_amount', Number, true)
  private _maintenanceAmount: number | null = null;

  @JsonProperty('maintenance_payment_schedule', String, true)
  private _maintenanceSchedule: string | null = null;

  @JsonProperty('utility_paid_by', String)
  private _utilityPaidBy = PaidByTypes.OWNER;

  @JsonProperty('furnishing', String)
  private _furnishing = FurnishingTypes.NONE;

  @JsonProperty('description', String, true)
  private _description = '';

  get id(): number {
    return this._id;
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

  get annualRentIncrementPercentage(): number {
    return this._annualRentIncrementPercentage;
  }

  get availableFromDate(): string {
    return this._availableFromDate;
  }

  get maintenancePaidBy(): PaidByTypes {
    return this._maintenancePaidBy;
  }

  get utilityPaidBy(): PaidByTypes {
    return this._utilityPaidBy;
  }

  get maintenanceAmount(): number | null {
    return this._maintenanceAmount;
  }

  get maintenanceSchedule(): ScheduleTypes {
    return this._maintenanceSchedule as ScheduleTypes;
  }

  get furnishing(): string {
    return this._furnishing;
  }

  get description(): string {
    return this._description;
  }

  get maximumLeasePeriod(): number {
    return this._maximumLeasePeriod;
  }

  get maintenanceUnit(): number {
    return this._maintenanceUnit.id;
  }
}
