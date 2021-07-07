import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';

@JsonObject('PaymentTransaction')
export class PaymentTransaction {
  @JsonProperty('id', Number)
  private _id = -1;

  @JsonProperty('expected_amount', Number)
  private _expectedAmount = -1;

  @JsonProperty('paid_amount', Number)
  private _paidAmount = -1;

  @JsonProperty('balance_amount', Number)
  private _balanceAmount = -1;

  get id(): number {
    return this._id;
  }

  get expectedAmount(): number {
    return this._expectedAmount;
  }

  get paid_amount(): number {
    return this._paidAmount;
  }

  get balance_amount(): number {
    return this._balanceAmount;
  }
}
