import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { Unit } from '@homzhub/common/src/domain/models/Unit';

@JsonObject('PaymentTransaction')
export class PaymentTransaction {
  @JsonProperty('id', Number)
  private _id = -1;

  @JsonProperty('expected_amount', Number)
  private _expectedAmount = -1;

  @JsonProperty('paid_amount', Number)
  private _paidAmount = null;

  @JsonProperty('balance_amount', Number)
  private _balanceAmount = -1;

  @JsonProperty('payment_type', Unit, true)
  private _paymentType = new Unit();

  get id(): number {
    return this._id;
  }

  get expectedAmount(): number {
    return this._expectedAmount;
  }

  get paid_amount(): number | null {
    return this._paidAmount;
  }

  get balance_amount(): number {
    return this._balanceAmount;
  }

  get paymentType(): Unit {
    return this._paymentType;
  }
}
