import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { ScheduleTypes } from '@homzhub/common/src/constants/Terms';
import { Unit } from '@homzhub/common/src/domain/models/Unit';

export interface ICreateSaleTermParams {
  expected_price: number;
  expected_booking_amount: number;
  available_from_date: string;
  maintenance_amount: number;
  maintenance_unit?: number;
  maintenance_payment_schedule?: ScheduleTypes;
  description?: string;
}

export interface IUpdateSaleTermParams {
  expected_price?: number;
  expected_booking_amount?: number;
  available_from_date?: string;
  maintenance_amount?: number;
  maintenance_unit?: number;
  maintenance_payment_schedule?: ScheduleTypes;
  description?: string;
}

@JsonObject('SaleTerm')
export class SaleTerm {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('expected_price', Number)
  private _expectedPrice = 0;

  @JsonProperty('expected_booking_amount', Number)
  private _expectedBookingAmount = -1;

  @JsonProperty('available_from_date', String)
  private _availableFromDate = '';

  @JsonProperty('tenanted_till', String, true)
  private _tenantedTill = '';

  @JsonProperty('maintenance_amount', Number, true)
  private _maintenanceAmount = -1;

  @JsonProperty('maintenance_unit', Unit, true)
  private _maintenanceUnit: Unit | null = null;

  @JsonProperty('maintenance_payment_schedule', String, true)
  private _maintenanceSchedule: ScheduleTypes | null = ScheduleTypes.MONTHLY;

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

  get maintenanceSchedule(): ScheduleTypes | null {
    return this._maintenanceSchedule;
  }

  get availableFromDate(): string {
    return this._availableFromDate;
  }

  get description(): string {
    return this._description;
  }

  get maintenanceUnit(): number | null {
    return this._maintenanceUnit?.id ?? null;
  }

  get tenantedTill(): string {
    return this._tenantedTill;
  }
}
