import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { ICardProp } from '@homzhub/common/src/components/molecules/DetailCard';

export interface IBankInfo {
  id: number;
  beneficiary_name: string;
  bank_name: string;
  account_number: string;
  ifsc_code: string;
  pan_number: string | null;
}

export enum BankAccountActions {
  EDIT = 'EDIT',
  DELETE = 'DELETE',
  DEACTIVATE = 'DEACTIVATE',
}

@JsonObject('BankInfo')
export class BankInfo {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('beneficiary_name', String)
  private _beneficiaryName = '';

  @JsonProperty('bank_name', String)
  private _bankName = '';

  @JsonProperty('account_number', String)
  private _accountNumber = '';

  @JsonProperty('ifsc_code', String)
  private _ifscCode = '';

  @JsonProperty('pan_number', String, true)
  private _panNumber = null;

  get id(): number {
    return this._id;
  }

  get beneficiaryName(): string {
    return this._beneficiaryName;
  }

  get bankName(): string {
    return this._bankName;
  }

  get accountNumber(): string {
    return this._accountNumber;
  }

  get ifscCode(): string {
    return this._ifscCode;
  }

  get panNumber(): string | null {
    return this._panNumber;
  }

  get bankDetail(): ICardProp {
    return {
      id: this._id,
      heading: this.beneficiaryName,
      value: this.id,
      label: `A/C Number - ${this.accountNumber}`,
      description: this.bankName,
      selectedValue: `${this.accountNumber} - ${this.bankName}`,
    };
  }
}
