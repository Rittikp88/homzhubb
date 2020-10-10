import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { Currency } from '@homzhub/common/src/domain/models/Currency';
import { ValueBundle } from '@homzhub/common/src/domain/models/ValueBundle';

export interface ISelectedValueServices {
  id: number;
  name: string;
  price: number;
  value: boolean;
}

@JsonObject('ValueAddedService')
export class ValueAddedService {
  @JsonProperty('id', Number, true)
  private _id = -1;

  @JsonProperty('bundle_price', Number, true)
  private _bundlePrice = -1;

  @JsonProperty('discounted_price', Number, true)
  private _discountedPrice = -1;

  @JsonProperty('currency', Currency, true)
  private _currency = new Currency();

  @JsonProperty('value_bundle', ValueBundle, true)
  private _valueBundle = new ValueBundle();

  get id(): number {
    return this._id;
  }

  get bundlePrice(): number {
    return this._bundlePrice;
  }

  get discountedPrice(): number {
    return this._discountedPrice;
  }

  get currency(): Currency {
    return this._currency;
  }

  get valueBundle(): ValueBundle {
    return this._valueBundle;
  }
}
