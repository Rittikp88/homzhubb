import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';

export enum Filters {
  ALL = 'ALL',
  RENTED = 'RENTED',
  FOR_RENT = 'FOR_RENT',
  FOR_SALE = 'FOR_SALE',
  FOR_MAINTENANCE = 'FOR_MAINTENANCE',
}

@JsonObject('AssetFilter')
export class AssetFilter {
  @JsonProperty('title', String)
  private _title = '';

  @JsonProperty('label', String)
  private _label = '';

  get title(): string {
    return this._title;
  }

  get label(): string {
    return this._label;
  }
}
