import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';

export interface IAssetFeature {
  name: string;
  locale_key: string;
  value: string;
}

@JsonObject('AssetFeature')
export class AssetFeature {
  @JsonProperty('name', String)
  private _name = '';

  @JsonProperty('locale_key', String)
  private _localeKey = '';

  @JsonProperty('value', String)
  private _value = '';

  get name(): string {
    return this._name;
  }

  get localeKey(): string {
    return this._localeKey;
  }

  get value(): string {
    return this._value;
  }
}
