import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { CurrencyUtils } from '@homzhub/common/src/utils/CurrencyUtils';
import { Asset, IAsset } from '@homzhub/common/src/domain/models/Asset';
import { Currency, ICurrency } from '@homzhub/common/src/domain/models/Currency';
import { PaymentTransaction } from '@homzhub/common/src/domain/models/PaymentTransaction';

export interface IDueItem {
  id: number;
  invoice_no: string;
  invoice_title: string;
  total_price: number;
  currency: ICurrency;
  asset: IAsset;
}
@JsonObject('DueItem')
export class DueItem {
  @JsonProperty('id', Number)
  private _id = -1;

  @JsonProperty('invoice_no', String)
  private _invoiceNo = '';

  @JsonProperty('invoice_title', String)
  private _invoiceTitle = '';

  @JsonProperty('total_price', Number)
  private _totalPrice = -1;

  @JsonProperty('currency', Currency)
  private _currency = new Currency();

  @JsonProperty('asset', Asset)
  private _asset = new Asset();

  @JsonProperty('payment_transaction', PaymentTransaction)
  private _paymentTransaction = new PaymentTransaction();

  @JsonProperty('created_at', String)
  private _createdAt = '';

  get id(): number {
    return this._id;
  }

  get invoiceNo(): string {
    return this._invoiceNo;
  }

  get invoiceTitle(): string {
    return this._invoiceTitle;
  }

  get totalPrice(): number {
    return this._totalPrice;
  }

  get currency(): Currency {
    return this._currency;
  }

  get asset(): Asset {
    return this._asset;
  }

  get paymentTransaction(): PaymentTransaction {
    return this._paymentTransaction;
  }

  get totalDue(): string {
    return `${this.currency.currencySymbol}${CurrencyUtils.getCurrency(this.currency.currencyCode, this.totalPrice)}`;
  }

  get createdAt(): string {
    return this._createdAt;
  }
}
