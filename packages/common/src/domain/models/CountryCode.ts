import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';

export interface ICarpetAreaUnit {
  label: string;
  value: string;
}

@JsonObject('CountryCode')
export class CountryCode {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('alpha_code', String)
  private _alphaCode = '';

  @JsonProperty('country_code', String)
  private _countryCode = '';

  @JsonProperty('country', String)
  private _country = '';

  get id(): number {
    return this._id;
  }

  get alphaCode(): string {
    return this._alphaCode;
  }

  get countryCode(): string {
    return this._countryCode;
  }

  get country(): string {
    return this._country;
  }
}
