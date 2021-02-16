import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';

export enum Filters {
  ALL = 'ALL',
  OCCUPIED = 'OCCUPIED',
  VACANT = 'VACANT',
  FOR_SALE = 'FOR_SALE',
  FOR_RENT = 'FOR_RENT',
  FOR__RENT = 'FOR RENT',
  FOR__SALE = 'FOR SALE',
  RENEWAL = 'RENEWAL',
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
