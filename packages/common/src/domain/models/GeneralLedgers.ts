import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';

export enum LedgerTypes {
  debit = 'DEBIT',
  credit = 'CREDIT',
}

export enum DataGroupBy {
  year = 'YEAR',
  month = 'MONTH',
}

export enum BarGraphLegends {
  income = 'Income',
  expense = 'Expense',
}

export interface IGeneralLedgerGraphData {
  key: number;
  title: string;
  value: number;
  svg: { fill: string };
}

@JsonObject('GeneralLedgers')
export class GeneralLedgers {
  @JsonProperty('entry_type', String)
  private _entryType = '';

  @JsonProperty('category', String)
  private _category = '';

  @JsonProperty('transaction_date_label', String)
  private _transactionDateLabel = '';

  @JsonProperty('amount', Number)
  private _amount = 0;

  get entryType(): string {
    return this._entryType;
  }

  get category(): string {
    return this._category;
  }

  get transactionDateLabel(): string {
    return this._transactionDateLabel;
  }

  get amount(): number {
    return this._amount;
  }
}
