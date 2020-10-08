import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { Unit } from '@homzhub/common/src/domain/models/Unit';
import { PaidByTypes, ScheduleTypes } from '@homzhub/common/src/constants/Terms';

export interface IManageTerm {
  first_name: string;
  last_name: string;
  email: string;
  country_code: string;
  phone_number: string;
  expected_monthly_rent: number;
  security_deposit: number;
  annual_rent_increment_percentage: number;
  minimum_lease_period: number;
  maximum_lease_period: number;
  available_from_date: string;
  maintenance_paid_by: string;
  maintenance_amount: number;
  maintenance_unit?: number;
  maintenance_schedule?: ScheduleTypes;
  utility_paid_by: string;
  description: string;
}

@JsonObject('ManageTerm')
export class ManageTerm {
  @JsonProperty('first_name', String)
  private _firstName = '';

  @JsonProperty('last_name', String)
  private _lastName = '';

  @JsonProperty('email', String)
  private _email = '';

  @JsonProperty('country_code', String)
  private _countryCode = '';

  @JsonProperty('phone_number', String)
  private _phoneNumber = '';

  @JsonProperty('expected_monthly_rent', Number)
  private _expectedPrice = -1;

  @JsonProperty('security_deposit', Number)
  private _securityDeposit = -1;

  @JsonProperty('minimum_lease_period', Number)
  private _minimumLeasePeriod = -1;

  @JsonProperty('maximum_lease_period', Number)
  private _maximumLeasePeriod = -1;

  @JsonProperty('annual_rent_increment_percentage', Number, true)
  private _annualRentIncrementPercentage = -1;

  @JsonProperty('available_from_date', String)
  private _availableFromDate = '';

  @JsonProperty('maintenance_paid_by', String)
  private _maintenancePaidBy = PaidByTypes.OWNER;

  @JsonProperty('maintenance_amount', Number, true)
  private _maintenanceAmount: number | null = null;

  @JsonProperty('utility_paid_by', String)
  private _utilityPaidBy = PaidByTypes.OWNER;

  @JsonProperty('maintenance_unit', Unit, true)
  private _maintenanceUnit = new Unit();

  @JsonProperty('maintenance_payment_schedule', String, true)
  private _maintenanceSchedule: string = ScheduleTypes.MONTHLY;

  @JsonProperty('description', String, true)
  private _description = '';

  get firstName(): string {
    return this._firstName;
  }

  get lastName(): string {
    return this._lastName;
  }

  get email(): string {
    return this._email;
  }

  get countryCode(): string {
    return this._countryCode;
  }

  get phoneNumber(): string {
    return this._phoneNumber;
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

  get maximumLeasePeriod(): number {
    return this._maximumLeasePeriod;
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

  get maintenanceAmount(): number | null {
    return this._maintenanceAmount;
  }

  get utilityPaidBy(): PaidByTypes {
    return this._utilityPaidBy;
  }

  get description(): string {
    return this._description;
  }

  get maintenanceUnit(): Unit {
    return this._maintenanceUnit;
  }

  get maintenanceSchedule(): string {
    return this._maintenanceSchedule;
  }
}
