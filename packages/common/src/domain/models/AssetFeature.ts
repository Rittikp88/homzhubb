import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';

export interface IAssetFeature {
  name: string;
  locale_key: string;
  value: number;
}

@JsonObject('AssetFeature')
export class AssetFeature {
  @JsonProperty('name', String)
  private _name = '';

  @JsonProperty('locale_key', String)
  private _localeKey = '';

  @JsonProperty('value', Number)
  private _value = 0;

  get name(): string {
    return this._name;
  }

  get localeKey(): string {
    return this._localeKey;
  }

  get value(): number {
    return this._value;
  }
}
