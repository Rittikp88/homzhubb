import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { theme } from '@homzhub/common/src/styles/theme';

@JsonObject('Tax')
export class Tax {
  @JsonProperty('tax_label', String)
  private _taxLabel = '';

  @JsonProperty('tax_percentage', Number)
  private _taxPercentage = 0;

  @JsonProperty('tax_amount', Number)
  private _taxAmount = 0;

  get taxLabel(): string {
    return this._taxLabel;
  }

  get taxPercentage(): number {
    return this._taxPercentage;
  }

  get taxAmount(): number {
    return this._taxAmount;
  }
}

@JsonObject('Promo')
export class Promo {
  @JsonProperty('code', String, true)
  private _code = '';

  @JsonProperty('saved_amount', Number, true)
  private _savedAmount = 0;

  @JsonProperty('percentage_applied', Number, true)
  private _percentageApplied = 0;

  @JsonProperty('absolute_applied', Number, true)
  private _absoluteApplied = 0;

  @JsonProperty('promo_applied', Boolean, true)
  private _promoApplied = false;

  get code(): string {
    return this._code;
  }

  get savedAmount(): number {
    return this._savedAmount;
  }

  get percentageApplied(): number {
    return this._percentageApplied;
  }

  get absoluteApplied(): number {
    return this._absoluteApplied;
  }

  get promoApplied(): boolean {
    return this._promoApplied;
  }
}

@JsonObject('Coins')
export class Coins {
  @JsonProperty('current_balance', Number)
  private _currentBalance = 0;

  @JsonProperty('saved_amount', Number)
  private _savedAmount = 0;

  @JsonProperty('currency_symbol', String, true)
  private _currencySymbol = '';

  @JsonProperty('currency_code', String, true)
  private _currencyCode = '';

  @JsonProperty('coins_used', Number)
  private _coinsUsed = 0;

  @JsonProperty('coins_applied', Boolean)
  private _coinsApplied = false;

  get currentBalance(): number {
    return this._currentBalance;
  }

  get savedAmount(): number {
    return this._savedAmount;
  }

  get currencySymbol(): string {
    return this._currencySymbol;
  }

  get currencyCode(): string {
    return this._currencyCode;
  }

  get coinsUsed(): number {
    return this._coinsUsed;
  }

  get coinsApplied(): boolean {
    return this._coinsApplied;
  }
}

@JsonObject('OrderTotalSummary')
export class OrderTotalSummary {
  @JsonProperty('title', String)
  private readonly _title: string = '';

  @JsonProperty('value', Number)
  private readonly _value: number = 0;

  @JsonProperty('value_color', String, true)
  private readonly _valueColor: string = theme.colors.darkTint3;

  constructor(title: string, value: number, valueColor: string = theme.colors.darkTint3) {
    this._title = title;
    this._value = value;
    this._valueColor = valueColor;
  }

  get title(): string {
    return this._title;
  }

  get value(): number {
    return this._value;
  }

  get valueColor(): string {
    return this._valueColor;
  }
}

@JsonObject('OrderSummary')
export class OrderSummary {
  @JsonProperty('order_total', Number)
  private _orderTotal = 0;

  @JsonProperty('sub_total', Number)
  private _subTotal = 0;

  @JsonProperty('amount_payable', Number)
  private _amountPayable = 0;

  @JsonProperty('coins', Coins, true)
  private _coins = new Coins();

  @JsonProperty('promo', Promo, true)
  private _promo = new Promo();

  @JsonProperty('tax', [Tax], true)
  private _tax = [new Tax()];

  get orderTotal(): OrderTotalSummary {
    return new OrderTotalSummary('Order Total', this._orderTotal);
  }

  get subTotal(): OrderTotalSummary {
    return new OrderTotalSummary('Sub Total', this._subTotal);
  }

  get amountPayable(): number {
    return this._amountPayable;
  }

  get amountPayableText(): OrderTotalSummary {
    return new OrderTotalSummary('You Pay', this._amountPayable);
  }

  get coins(): Coins {
    return this._coins;
  }

  get promo(): Promo {
    return this._promo;
  }

  get tax(): Tax[] {
    return this._tax;
  }

  get summaryList(): OrderTotalSummary[] {
    const summary: OrderTotalSummary[] = [];
    summary.push(this.orderTotal);

    if (this.coins && this.coins.coinsApplied) {
      const coins = new OrderTotalSummary('Coins Discount', this.coins.savedAmount, theme.colors.green);
      summary.push(coins);
    }

    if (this.promo && this.promo.promoApplied) {
      const title = `Discount(${this.promo.percentageApplied}%)`;
      const promo = new OrderTotalSummary(title, this.promo.savedAmount, theme.colors.green);
      summary.push(promo);
    }

    summary.push(this.subTotal);

    if (this.tax && this.tax[0].taxAmount > 0) {
      const tax = this.tax[0];
      const title = `${tax.taxLabel}(${tax.taxPercentage}%)`;
      const taxData = new OrderTotalSummary(title, tax.taxAmount);
      summary.push(taxData);
    }

    return summary;
  }
}
