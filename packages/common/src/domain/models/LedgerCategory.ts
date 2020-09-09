import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';

@JsonObject('LedgerCategory')
export class LedgerCategory {
  @JsonProperty('id', Number)
  private _id = '';

  @JsonProperty('entry_type', String, true)
  private _entryType = '';

  @JsonProperty('name', String)
  private _name = '';

  get id(): string {
    return this._id;
  }

  get entryType(): string {
    return this._entryType;
  }

  get name(): string {
    return this._name;
  }
}
