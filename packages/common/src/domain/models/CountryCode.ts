import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { Currency, ICurrency } from '@homzhub/common/src/domain/models/Currency';

export interface ICarpetAreaUnit {
  label: string;
  value: string;
}

export interface ICountry {
  id: number;
  name: string;
  iso2_code: string;
  iso3_code: string;
  phone_codes: string[];
  currencies: ICurrency[];
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

@JsonObject('Country')
export class Country {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('name', String)
  private _name = '';

  @JsonProperty('iso2_code', String)
  private _iso2Code = '';

  @JsonProperty('iso3_code', String)
  private _iso3Code = '';

  @JsonProperty('phone_codes', [String])
  private _phoneCodes = [];

  @JsonProperty('currencies', [Currency])
  private _currencies = [];

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get iso2Code(): string {
    return this._iso2Code;
  }

  get iso3Code(): string {
    return this._iso3Code;
  }

  get phoneCodes(): string[] {
    return this._phoneCodes;
  }

  get currencies(): Currency[] {
    return this._currencies;
  }
}
