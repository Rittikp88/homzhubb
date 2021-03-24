import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { ProspectProfile } from '@homzhub/common/src/domain/models/ProspectProfile';
import { Unit } from '@homzhub/common/src/domain/models/Unit';

// TODO: (Shikha) Verify status with BE
export enum Status {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export enum OfferAction {
  ACCEPT = 'ACCEPT',
  REJECT = 'REJECT',
  CANCEL = 'CANCEL',
}

export interface IOfferValue {
  key: string;
  value: string;
  icon?: string;
  iconColor?: string;
}

@JsonObject('Offer')
export class Offer {
  @JsonProperty('prospect', ProspectProfile, true)
  private _count = 0;

  @JsonProperty('created_at', String)
  private _createdAt = '';

  @JsonProperty('proposed_rent', Number, true)
  private _rent = -1;

  @JsonProperty('proposed_price', Number, true)
  private _price = -1;

  @JsonProperty('proposed_security_deposit', Number, true)
  private _securityDeposit = -1;

  @JsonProperty('proposed_booking_amount', Number, true)
  private _bookingAmount = -1;

  @JsonProperty('proposed_annual_rent_increment_percentage', Number, true)
  private _annualRentIncrementPercentage = -1;

  @JsonProperty('proposed_move_in_date', String, true)
  private _moveInDate = '';

  @JsonProperty('proposed_lease_period', Number, true)
  private _leasePeriod = -1;

  @JsonProperty('proposed_min_lock_in_period', Number, true)
  private _minLockInPeriod = -1;

  @JsonProperty('tenant_preferences', [Unit], true)
  private _tenantPreferences = [new Unit()];

  @JsonProperty('actions', [String])
  private _actions = [];

  @JsonProperty('status', String)
  private _status = '';

  @JsonProperty('is_counter', Boolean, true)
  private _isCounter = false;

  get count(): number {
    return this._count;
  }

  get createdAt(): string {
    return this._createdAt;
  }

  get rent(): number {
    return this._rent;
  }

  get securityDeposit(): number {
    return this._securityDeposit;
  }

  get annualRentIncrementPercentage(): number {
    return this._annualRentIncrementPercentage;
  }

  get moveInDate(): string {
    return this._moveInDate;
  }

  get leasePeriod(): number {
    return this._leasePeriod;
  }

  get minLockInPeriod(): number {
    return this._minLockInPeriod;
  }

  get tenantPreferences(): Unit[] {
    return this._tenantPreferences;
  }

  get actions(): string[] {
    return this._actions;
  }

  get status(): Status {
    return this._status as Status;
  }

  get isCounter(): boolean {
    return this._isCounter;
  }

  get price(): number {
    return this._price;
  }

  get bookingAmount(): number {
    return this._bookingAmount;
  }
}
