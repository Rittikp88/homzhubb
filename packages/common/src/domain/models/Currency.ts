import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';

@JsonObject('Currency')
export class Currency {
  @JsonProperty('currency_symbol', String)
  private _currencySymbol = '';

  @JsonProperty('currency_code', String)
  private _currencyCode = '';

  get currencySymbol(): string {
    return this._currencySymbol;
  }

  get currencyCode(): string {
    return this._currencyCode;
  }
}
