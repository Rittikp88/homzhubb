import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { Currency, ICurrency } from '@homzhub/common/src/domain/models/Currency';

export interface IMaintenance {
  amount: number;
  currency: ICurrency;
}

@JsonObject('Maintenance')
export class Maintenance {
  @JsonProperty('amount', Number)
  private _amount = 0;

  @JsonProperty('currency', Currency)
  private _currency = new Currency();

  get amount(): number {
    return this._amount;
  }

  get currency(): Currency {
    return this._currency;
  }
}
