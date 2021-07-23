import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { Asset, IAsset } from '@homzhub/common/src/domain/models/Asset';
import { ILeasePeriod } from '@homzhub/common/src/domain/models/LeaseTransaction';
import { Unit, IUnit } from '@homzhub/common/src/domain/models/Unit';

export interface IReminder {
  id: number;
  title: string;
  description: string;
  emails: string[];
  reminder_category: IUnit;
  reminder_frequency: IUnit;
  asset: IAsset;
  lease_transaction: ILeasePeriod;
  start_date: string;
}

@JsonObject('Reminder')
export class Reminder {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('title', String)
  private _title = 0;

  @JsonProperty('description', String, true)
  private _description = '';

  @JsonProperty('emails', [String])
  private _emails = [];

  @JsonProperty('reminder_category', Unit)
  private _reminderCategory = new Unit();

  @JsonProperty('reminder_frequency', Unit)
  private _reminderFrequency = new Unit();

  @JsonProperty('asset', Asset)
  private _asset = null;

  // Todo (Praharsh) Change this after verifying with API response
  // @JsonProperty('lease_transaction', LeaseTransaction, true)
  // private _leaseTransaction = new LeaseTransaction();

  @JsonProperty('start_date', String)
  private _startDate = '';

  get id(): number {
    return this._id;
  }

  get title(): number {
    return this._title;
  }

  get description(): string {
    return this._description;
  }

  get emails(): string[] {
    return this._emails;
  }

  get reminderCategory(): Unit {
    return this._reminderCategory;
  }

  get reminderFrequency(): Unit {
    return this._reminderFrequency;
  }

  get asset(): Asset {
    return this._asset;
  }

  // get leaseTransaction(): LeaseTransaction {
  //   return this._leaseTransaction;
  // }

  get startDate(): string {
    return this._startDate;
  }
}
