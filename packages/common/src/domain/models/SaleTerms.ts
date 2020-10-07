import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { ScheduleTypes } from '@homzhub/common/src/constants/Terms';
import { ILastVisitedStep } from '@homzhub/common/src/domain/models/Asset';

export interface ICreateSaleTermDetails {
  expected_price: number;
  expected_booking_amount: number;
  available_from_date: string;
  maintenance_amount: number;
  maintenance_unit?: number;
  maintenance_payment_schedule?: ScheduleTypes;
  description?: string;
  last_visited_step: ILastVisitedStep;
}

export interface IUpdateSaleTermDetails {
  expected_price?: number;
  expected_booking_amount?: number;
  available_from_date?: string;
  maintenance_amount?: number;
  maintenance_unit?: number;
  maintenance_payment_schedule?: ScheduleTypes;
  description?: string;
  last_visited_step?: ILastVisitedStep;
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

  @JsonProperty('maintenance_unit', Number, true)
  private _maintenanceUnit = -1;

  @JsonProperty('maintenance_payment_schedule', String, true)
  private _maintenanceSchedule = ScheduleTypes.MONTHLY;

  @JsonProperty('available_from_date', String)
  private _availableFromDate = '';

  @JsonProperty('description', String)
  private _description = '';

  get id(): number {
    return this._id;
  }

  get expectedPrice(): string {
    return this._expectedPrice.toString();
  }

  get expectedBookingAmount(): string {
    return this._expectedBookingAmount.toString();
  }

  get maintenanceAmount(): string {
    return this._maintenanceAmount.toString();
  }

  get maintenanceSchedule(): ScheduleTypes {
    return this._maintenanceSchedule;
  }

  get availableFromDate(): string {
    return this._availableFromDate;
  }

  get description(): string {
    return this._description;
  }

  get maintenanceUnit(): number {
    return this._maintenanceUnit;
  }
}
