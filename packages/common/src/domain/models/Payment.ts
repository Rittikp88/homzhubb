import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';

@JsonObject('PaymentPreFill')
export class PaymentPreFill {
  @JsonProperty('name', String)
  private _name = '';

  @JsonProperty('email', String)
  private _email = '';

  @JsonProperty('contact', String)
  private _contact = '';

  get name(): string {
    return this._name;
  }

  get email(): string {
    return this._email;
  }

  get contact(): string {
    return this._contact;
  }
}

@JsonObject('PaymentNote')
export class PaymentNote extends PaymentPreFill {
  @JsonProperty('description', String)
  private _description = '';

  @JsonProperty('user_invoice_no', String)
  private _userInvoiceNo = '';

  get description(): string {
    return this._description;
  }

  get userInvoiceNo(): string {
    return this._userInvoiceNo;
  }
}

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
