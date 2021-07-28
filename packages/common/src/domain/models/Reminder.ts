import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { Asset, IAsset } from '@homzhub/common/src/domain/models/Asset';
import { Unit, IUnit } from '@homzhub/common/src/domain/models/Unit';

export interface IReminder {
  id: number;
  title: string;
  description: string;
  emails: string[];
  reminder_category: IUnit;
  reminder_frequency: IUnit;
  asset: IAsset;
  start_date: string;
}

@JsonObject('Reminder')
export class Reminder {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('title', String)
  private _title = '';

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

  @JsonProperty('start_date', String)
  private _startDate = '';

  @JsonProperty('next_reminder_date', String)
  private _nextReminderDate = '';

  /*
   * 28-July-2021
   * Used Unit as a type because only Id is returning from BE.
   * If needed update lease_transaction model
   */
  @JsonProperty('lease_transaction', Unit)
  private _leaseTransaction = new Unit();

  get id(): number {
    return this._id;
  }

  get title(): string {
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

  get asset(): Asset | null {
    return this._asset;
  }

  get startDate(): string {
    return this._startDate;
  }

  get nextReminderDate(): string {
    return this._nextReminderDate;
  }

  get leaseTransaction(): Unit {
    return this._leaseTransaction;
  }
}
