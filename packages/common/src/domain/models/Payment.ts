import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { PaymentPreFill } from '@homzhub/common/src/domain/models/PaymentPreFill';
import { PaymentNote } from '@homzhub/common/src/domain/models/PaymentNote';

@JsonObject('Payment')
export class Payment {
  @JsonProperty('payment_transaction', Number)
  private _paymentTransaction = -1;

  @JsonProperty('amount', Number)
  private _amount = 0;

  @JsonProperty('currency', String)
  private _currency = 'INR';

  @JsonProperty('name', String)
  private _name = '';

  @JsonProperty('description', String)
  private _description = '';

  @JsonProperty('order_id', String)
  private _orderId = '';

  @JsonProperty('user_invoice', String)
  private _userInvoice = '';

  @JsonProperty('prefill', PaymentPreFill)
  private _prefill = new PaymentPreFill();

  @JsonProperty('notes', PaymentNote)
  private _notes = new PaymentNote();

  get paymentTransaction(): number {
    return this._paymentTransaction;
  }

  get amount(): number {
    return this._amount;
  }

  get currency(): string {
    return this._currency;
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  get orderId(): string {
    return this._orderId;
  }

  get userInvoice(): string {
    return this._userInvoice;
  }

  get prefill(): PaymentPreFill {
    return this._prefill;
  }

  get notes(): PaymentNote {
    return this._notes;
  }
}