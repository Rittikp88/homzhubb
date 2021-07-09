import { IDues } from '@homzhub/common/src/domain/models/Dues';
import { IFinancialTransaction } from '@homzhub/common/src/domain/models/FinancialTransactions';
import { IPaymentPayload } from '@homzhub/common/src/domain/repositories/interfaces';

export interface IFinancialState {
  transactions: null | IFinancialTransaction;
  dues: IDues | null;
  loaders: {
    transactions: boolean;
    dues: boolean;
    payment: boolean;
  };
}

export interface IProcessPaymentPayload {
  data: IPaymentPayload;
  onCallback?: (status: boolean) => void;
}
