import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { ScheduleTypes } from '@homzhub/common/src/domain/models/LeaseTerms';

export interface ICreateSaleTermDetails {
  currency_code: string;
  expected_price: number;
  expected_booking_amount: number;
  construction_year: number;
  available_from_date: string;
  maintenance_amount: number;
  maintenance_payment_schedule: ScheduleTypes;
}

export interface IUpdateSaleTermDetails {
  currency_code?: string;
  expected_price?: number;
  expected_booking_amount?: number;
  construction_year?: number;
  available_from_date?: string;
  maintenance_amount?: number;
  maintenance_payment_schedule?: ScheduleTypes;
}

export interface ISaleDetails extends ICreateSaleTermDetails {
  id: number;
}

@JsonObject('SaleTerms')
export class SaleTerms {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('expected_price', Number)
  private _expectedPrice = 0;

  @JsonProperty('expected_booking_amount', Number)
  private _expectedBookingAmount = -1;

  @JsonProperty('maintenance_amount', Number)
  private _maintenanceAmount = -1;

  @JsonProperty('maintenance_payment_schedule', String)
  private _maintenanceSchedule = '';

  @JsonProperty('available_from_date', String)
  private _availableFromDate = '';

  @JsonProperty('tenanted_till', String)
  private _tenantedTill = '';

  @JsonProperty('currency_code', String)
  private _currencyCode = 'INR';

  @JsonProperty('currency_symbol', String)
  private _currencySymbol = 'INR';

  get id(): number {
    return this._id;
  }

  get expectedPrice(): number {
    return this._expectedPrice;
  }

  get expectedBookingAmount(): number {
    return this._expectedBookingAmount;
  }

  get maintenanceAmount(): number {
    return this._maintenanceAmount;
  }

  get maintenanceSchedule(): string {
    return this._maintenanceSchedule;
  }

  get availableFromDate(): string {
    return this._availableFromDate;
  }

  get tenantedTill(): string {
    return this._tenantedTill;
  }

  get currencyCode(): string {
    return this._currencyCode;
  }

  get currencySymbol(): string {
    return this._currencySymbol;
  }
}
