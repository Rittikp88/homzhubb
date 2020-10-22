import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { Currency, ICurrency } from '@homzhub/common/src/domain/models/Currency';
import { IDropdownOption } from '@homzhub/common/src/components/molecules/FormDropdown';

export interface ICountry {
  id: number;
  name: string;
  iso2_code: string;
  iso3_code: string;
  phone_codes: string[];
  currencies: ICurrency[];
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

  get phoneCodesDropdownData(): IDropdownOption[] {
    const countryCodeOptions: IDropdownOption[] = [];

    this.phoneCodes.forEach((code) => {
      const data = {
        label: `${this.name} (${code})`,
        value: code,
      };
      countryCodeOptions.push(data);
    });

    return countryCodeOptions;
  }

  get flag(): string {
    return `https://www.countryflags.io/${this.iso2Code}/flat/48.png`;
  }
}
