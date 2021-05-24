import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { FormType } from '@homzhub/mobile/src/components/organisms/AddRecordForm';
import { Attachment } from '@homzhub/common/src/domain/models/Attachment';
import { Currency } from '@homzhub/common/src/domain/models/Currency';
import { LedgerTypes } from '@homzhub/common/src/domain/models/GeneralLedgers';
import { LedgerCategory } from '@homzhub/common/src/domain/models/LedgerCategory';
import { Links } from '@homzhub/common/src/domain/models/PaginationLinks';
import { Property } from '@homzhub/common/src/domain/models/Property';

@JsonObject('FinancialRecords')
export class FinancialRecords {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('entry_type', String, true)
  private _entryType = '';

  @JsonProperty('category', LedgerCategory)
  private _category: LedgerCategory | null = null;

  @JsonProperty('amount', Number)
  private _amount = 0;

  @JsonProperty('transaction_date', String)
  private _transactionDate = '';

  @JsonProperty('label', String)
  private _label = '';

  @JsonProperty('notes', String)
  private _notes = '';

  @JsonProperty('payer_name', String)
  private _payerName = '';

  @JsonProperty('receiver_name', String)
  private _receiverName = '';

  @JsonProperty('asset', Property)
  private _asset: Property | null = null;

  @JsonProperty('currency', Currency)
  private _currency: Currency = new Currency();

  @JsonProperty('attachments', [Attachment], true)
  private _attachments: Attachment[] = [new Attachment()];

  @JsonProperty('is_system_generated', Boolean, true)
  private _isSystemGenerated = false;

  get id(): number {
    return this._id;
  }

  get entryType(): string {
    return this._entryType;
  }

  get category(): string {
    return this._category?.name || '';
  }

  get categoryId(): number {
    return Number(this._category?.id) || 0;
  }

  get amount(): number {
    return this._amount;
  }

  get transactionDate(): string {
    return this._transactionDate;
  }

  get label(): string {
    return this._label;
  }

  get notes(): string {
    return this._notes;
  }

  get payerName(): string {
    return this._payerName;
  }

  get receiverName(): string {
    return this._receiverName;
  }

  get tellerName(): string {
    return this.entryType === LedgerTypes.credit ? this.payerName : this.receiverName;
  }

  get assetName(): string {
    return this._asset?.projectName || '';
  }

  get attachmentDetails(): Attachment[] {
    return this._attachments;
  }

  get asset(): Property | null {
    return this._asset;
  }

  get currency(): Currency {
    return this._currency;
  }

  get formType(): FormType {
    return this.entryType === LedgerTypes.credit ? FormType.Income : FormType.Expense;
  }

  get isSystemGenerated(): boolean {
    return this._isSystemGenerated;
  }
}

@JsonObject('FinancialTransactions')
export class FinancialTransactions {
  @JsonProperty('count', Number)
  private _count = 0;

  @JsonProperty('results', [FinancialRecords])
  private _results: FinancialRecords[] | [] = [];

  @JsonProperty('links', Links)
  private _links: Links | null = null;

  get count(): number {
    return this._count;
  }

  get results(): FinancialRecords[] | [] {
    return this._results;
  }
}
