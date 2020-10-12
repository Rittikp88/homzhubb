import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { Currency, ICurrency } from '@homzhub/common/src/domain/models/Currency';
import { IValueBundle, ValueBundle } from '@homzhub/common/src/domain/models/ValueBundle';

export interface ISelectedValueServices {
  id: number;
  value: boolean;
}

export interface IValueAddedServices {
  id: number;
  bundlePrice: string;
  discountedPrice: number;
  currency: ICurrency;
  valueBundle: IValueBundle;
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

  @JsonProperty('value', Boolean, true)
  private _value = false;

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

  get value(): boolean {
    return this._value;
  }

  set value(value: boolean) {
    this._value = value;
  }
}
