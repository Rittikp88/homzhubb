import { DateFilter } from '@homzhub/common/src/constants/FinanceOverview';
import { IDues } from '@homzhub/common/src/domain/models/Dues';
import { IFinancialTransaction } from '@homzhub/common/src/domain/models/FinancialTransactions';
import { IGeneralLedgers } from '@homzhub/common/src/domain/models/GeneralLedgers';
import { IPaymentPayload } from '@homzhub/common/src/domain/repositories/interfaces';

export interface ILedgerMetrics {
  income: string;
  expense: string;
}
export interface ILedgers {
  selectedProperty: number;
  selectedCountry: number;
  selectedTimeRange: DateFilter;
  ledgerData: IGeneralLedgers[];
  ledgerMetrics: ILedgerMetrics;
}

export interface IFinancialState {
  transactions: null | IFinancialTransaction;
  dues: IDues | null;
  ledgers: ILedgers;
  loaders: {
    transactions: boolean;
    dues: boolean;
    payment: boolean;
    ledgers: boolean;
  };
}

export interface IProcessPaymentPayload {
  data: IPaymentPayload;
  onCallback?: (status: boolean) => void;
}
