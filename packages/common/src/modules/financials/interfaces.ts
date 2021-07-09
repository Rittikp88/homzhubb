import { IDues } from '@homzhub/common/src/domain/models/Dues';
import { IFinancialTransaction } from '@homzhub/common/src/domain/models/FinancialTransactions';

export interface IFinancialState {
  transactions: null | IFinancialTransaction;
  dues: IDues | null;
  loaders: {
    transactions: boolean;
    dues: boolean;
  };
}
