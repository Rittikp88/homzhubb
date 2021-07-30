import { DateFilter } from '@homzhub/common/src/constants/FinanceOverview';
import { IAsset } from '@homzhub/common/src/domain/models/Asset';
import { IDues } from '@homzhub/common/src/domain/models/Dues';
import { IFinancialTransaction } from '@homzhub/common/src/domain/models/FinancialTransactions';
import { IGeneralLedgers } from '@homzhub/common/src/domain/models/GeneralLedgers';
import { IPaymentPayload, IReminderPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { IReminder } from '@homzhub/common/src/domain/models/Reminder';
import { IUnit } from '@homzhub/common/src/domain/models/Unit';

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
  currentDueId: number;
  currentReminderId: number;
  ledgers: ILedgers;
  reminderCategories: IUnit[];
  reminderFrequencies: IUnit[];
  reminders: IReminder[];
  reminderAssets: IAsset[];
  loaders: {
    transactions: boolean;
    dues: boolean;
    payment: boolean;
    ledgers: boolean;
    reminder: boolean;
    reminderAsset: boolean;
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

export interface IUpdateReminderPayload {
  id: number;
  data: IReminderPayload;
  onCallback?: (status: boolean) => void;
}
