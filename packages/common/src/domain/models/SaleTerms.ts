import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { ScheduleTypes } from '@homzhub/common/src/domain/models/LeaseTerms';

export interface ICreateSaleTermDetails {
  currency_code: string;
  expected_price: number;
  expected_booking_amount: number;
  year_of_construction: number;
  available_from_date: string;
  maintenance_amount: number;
  maintenance_schedule: ScheduleTypes;
}

export interface IUpdateSaleTermDetails {
  currency_code?: string;
  expected_price?: number;
  expected_booking_amount?: number;
  year_of_construction?: number;
  available_from_date?: string;
  maintenance_amount?: number;
  maintenance_schedule?: ScheduleTypes;
}

export interface ISaleDetails extends ICreateSaleTermDetails {
  id: number;
}

@JsonObject('SaleTerms')
export class SaleTerms {
  @JsonProperty('id', Number)
  private _id = '';

  @JsonProperty('available_from_date', String, true)
  private _availableFromDate = '';

  @JsonProperty('expected_booking_amount', Number, true)
  private _expectedBookingAmount = -1;

  @JsonProperty('maintenance_amount', Number, true)
  private _maintenanceAmount = -1;

  @JsonProperty('expected_price', Number, true)
  private _expectedPrice = 0;

  @JsonProperty('maintenance_schedule', String, true)
  private _maintenanceSchedule = '';

  get id(): string {
    return this._id;
  }

  get availableFromDate(): string {
    return this._availableFromDate;
  }

  get expectedPrice(): number {
    return this._expectedPrice;
  }

  get maintenanceSchedule(): string {
    return this._maintenanceSchedule;
  }

  get expectedBookingAmount(): number {
    return this._expectedBookingAmount;
  }

  get maintenanceAmount(): number {
    return this._maintenanceAmount;
  }
}
