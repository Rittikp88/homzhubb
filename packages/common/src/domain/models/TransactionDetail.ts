import { DateFormats, DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { Currency } from '@homzhub/common/src/domain/models/Currency';
import { Unit } from '@homzhub/common/src/domain/models/Unit';
import { PaidByTypes, ScheduleTypes } from '@homzhub/common/src/constants/Terms';

@JsonObject('TransactionDetail')
export class TransactionDetail {
  @JsonProperty('id', Number, true)
  private _id = 0;

  @JsonProperty('lease_start_date', String)
  private _leaseStartDate = '';

  @JsonProperty('lease_end_date', String)
  private _leaseEndDate = '';

  @JsonProperty('total_lease_period', String)
  private _totalLeasePeriod = '';

  @JsonProperty('remaining_lease_period', String)
  private _remainingLeasePeriod = '';

  @JsonProperty('currency', Currency)
  private _currency = new Currency();

  @JsonProperty('rent', Number)
  private _rent = 0;

  @JsonProperty('security_deposit', Number)
  private _securityDeposit = 0;

  @JsonProperty('lease_period', Number)
  private _leasePeriod = 0;

  @JsonProperty('minimum_lease_period', Number)
  private _minimumLeasePeriod = 0;

  @JsonProperty('annual_rent_increment_percentage', Number, true)
  private _annualRentIncrementPercentage = null;

  @JsonProperty('status', String)
  private _status = '';

  @JsonProperty('tentative_end_date', String)
  private _tentativeEndDate = '';

  @JsonProperty('agreement_date', String)
  private _agreementDate = '';

  @JsonProperty('lease_listing', Number, true)
  private _leaseListing = null;

  @JsonProperty('lease_unit', Number)
  private _leaseUnit = 0;

  @JsonProperty('is_terminated', Boolean)
  private _isTerminated = false;

  @JsonProperty('maintenance_paid_by', String)
  private _maintenancePaidBy = '';

  @JsonProperty('utility_paid_by', String)
  private _utilityPaidBy = '';

  @JsonProperty('maintenance_amount', Number, true)
  private _maintenanceAmount = null;

  @JsonProperty('maintenance_payment_schedule', String)
  private _maintenancePaymentSchedule = '';

  @JsonProperty('maintenance_unit', Unit)
  private _maintenanceUnit: Unit = new Unit();

  get id(): number {
    return this._id;
  }

  get leaseStartDate(): string {
    return DateUtils.getDisplayDate(this._leaseStartDate, DateFormats.YYYYMMDD);
  }

  get leaseEndDate(): string {
    return DateUtils.getDisplayDate(this._leaseEndDate, DateFormats.YYYYMMDD);
  }

  get totalLeasePeriod(): string {
    return this._totalLeasePeriod;
  }

  get remainingLeasePeriod(): string {
    return this._remainingLeasePeriod;
  }

  get currency(): Currency {
    return this._currency;
  }

  get rent(): number {
    return this._rent;
  }

  get securityDeposit(): number {
    return this._securityDeposit;
  }

  get leasePeriod(): number {
    return this._leasePeriod;
  }

  get minimumLeasePeriod(): number {
    return this._minimumLeasePeriod;
  }

  get annualRentIncrementPercentage(): number | null {
    return this._annualRentIncrementPercentage;
  }

  get status(): string {
    return this._status;
  }

  get tentativeEndDate(): string {
    return this._tentativeEndDate;
  }

  get agreementDate(): string {
    return this._agreementDate;
  }

  get leaseListing(): number | null {
    return this._leaseListing;
  }

  get leaseUnit(): number {
    return this._leaseUnit;
  }

  get isTerminated(): boolean {
    return this._isTerminated;
  }

  get maintenancePaidBy(): PaidByTypes {
    return this._maintenancePaidBy as PaidByTypes;
  }

  get utilityPaidBy(): PaidByTypes {
    return this._utilityPaidBy as PaidByTypes;
  }

  get maintenanceAmount(): number | null {
    return this._maintenanceAmount;
  }

  get maintenancePaymentSchedule(): ScheduleTypes {
    return this._maintenancePaymentSchedule as ScheduleTypes;
  }

  get maintenanceUnit(): Unit {
    return this._maintenanceUnit;
  }
}
