import moment from 'moment';
import { DateFormats } from '@homzhub/common/src/utils/DateUtils';
import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';

export interface ILabelColor {
  label: string;
  color: string;
}

@JsonObject('LabelColor')
export class LabelColor {
  @JsonProperty('label', String)
  private _label = '';

  @JsonProperty('color', String)
  private _color = '';

  get label(): string {
    return this._label;
  }

  get color(): string {
    return this._color;
  }
}

@JsonObject('Transaction')
export class Transaction {
  @JsonProperty('label', String)
  private _label = '';

  @JsonProperty('currency_code', String)
  private _currencyCode = '';

  @JsonProperty('currency_symbol', String)
  private _currencySymbol = '';

  @JsonProperty('amount', Number)
  private _amount = 0;

  @JsonProperty('status', String)
  private _status = '';

  get label(): string {
    return this._label;
  }

  get currencyCode(): string {
    return this._currencyCode;
  }

  get currencySymbol(): string {
    return this._currencySymbol;
  }

  get amount(): number {
    return this._amount;
  }

  get status(): string {
    return this._status;
  }
}

@JsonObject('LeasePeriod')
export class LeasePeriod {
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

  @JsonProperty('action', LabelColor, true)
  private _action: LabelColor | null = null;

  get id(): number {
    return this._id;
  }

  get leaseStartDate(): string {
    return moment(this._leaseStartDate, DateFormats.ISO).format('DD/MM/YYYY');
  }

  get leaseEndDate(): string {
    return moment(this._leaseEndDate, DateFormats.ISO).format('DD/MM/YYYY');
  }

  get totalLeasePeriod(): string {
    return this._totalLeasePeriod.substr(0, this._totalLeasePeriod.indexOf(' '));
  }

  get remainingLeasePeriod(): string {
    return this._remainingLeasePeriod.substr(0, this._remainingLeasePeriod.indexOf(' '));
  }

  get action(): LabelColor | null {
    return this._action;
  }

  get totalSpendPeriod(): number {
    const newPeriod = Number(this.totalLeasePeriod) - Number(this.remainingLeasePeriod);
    return newPeriod / Number(this.totalLeasePeriod);
  }
}

@JsonObject('LeaseTransaction')
export class LeaseTransaction {
  @JsonProperty('rent', Transaction, true)
  private _rent: Transaction | null = null;

  @JsonProperty('security_deposit', Transaction, true)
  private _securityDeposit: Transaction | null = null;

  @JsonProperty('lease_period', LeasePeriod, true)
  private _leasePeriod: LeasePeriod | null = null;

  get rent(): Transaction | null {
    return this._rent;
  }

  get securityDeposit(): Transaction | null {
    return this._securityDeposit;
  }

  get leasePeriod(): LeasePeriod | null {
    return this._leasePeriod;
  }
}
