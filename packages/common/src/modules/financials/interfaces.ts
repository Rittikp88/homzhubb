import { IDues } from '@homzhub/common/src/domain/models/Dues';
import { IFinancialTransaction } from '@homzhub/common/src/domain/models/FinancialTransactions';
import { IGeneralLedgers } from '@homzhub/common/src/domain/models/GeneralLedgers';
import { IUnit } from '@homzhub/common/src/domain/models/Unit';
import { IPaymentPayload, IReminderPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { DateFilter } from '@homzhub/common/src/constants/FinanceOverview';

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
  reminderCategories: IUnit[];
  reminderFrequencies: IUnit[];
  loaders: {
    transactions: boolean;
    dues: boolean;
    payment: boolean;
    ledgers: boolean;
    reminder: boolean;
  };
}

export interface IProcessPaymentPayload {
  data: IPaymentPayload;
  onCallback?: (status: boolean) => void;
}

export interface IAddReminderPayload {
  data: IReminderPayload;
  onCallback?: (status: boolean) => void;
}
