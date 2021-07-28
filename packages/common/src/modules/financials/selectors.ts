import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { DueItem } from '@homzhub/common/src/domain/models/DueItem';
import { Dues } from '@homzhub/common/src/domain/models/Dues';
import { FinancialRecords, FinancialTransactions } from '@homzhub/common/src/domain/models/FinancialTransactions';
import { GeneralLedgers } from '@homzhub/common/src/domain/models/GeneralLedgers';
import { Reminder } from '@homzhub/common/src/domain/models/Reminder';
import { Unit } from '@homzhub/common/src/domain/models/Unit';
import { IFinancialState, ILedgerMetrics } from '@homzhub/common/src/modules/financials/interfaces';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { DateFilter } from '@homzhub/common/src/constants/FinanceOverview';

const getTransactions = (state: IState): FinancialTransactions | null => {
  const {
    financials: { transactions },
  } = state;
  if (!transactions) return null;
  return ObjectMapper.deserialize(FinancialTransactions, transactions);
};

const getTransactionRecords = (state: IState): FinancialRecords[] => {
  const {
    financials: { transactions },
  } = state;
  if (!transactions) return [];
  return ObjectMapper.deserializeArray(FinancialRecords, transactions.results);
};

const getTransactionsCount = (state: IState): number => {
  const {
    financials: { transactions },
  } = state;
  if (!transactions) return -1;
  return transactions.count;
};

const getDues = (state: IState): Dues | null => {
  const {
    financials: { dues },
  } = state;
  if (!dues) return null;
  return ObjectMapper.deserialize(Dues, dues);
};

const getFinancialLoaders = (state: IState): IFinancialState['loaders'] => {
  return state.financials.loaders;
};

const getLedgerData = (state: IState): GeneralLedgers[] => {
  const {
    financials: {
      ledgers: { ledgerData },
    },
  } = state;

  return ObjectMapper.deserializeArray(GeneralLedgers, ledgerData);
};

const getSelectedCountry = (state: IState): number => {
  const {
    financials: {
      ledgers: { selectedCountry },
    },
  } = state;
  return selectedCountry;
};

const getSelectedProperty = (state: IState): number => {
  const {
    financials: {
      ledgers: { selectedProperty },
    },
  } = state;
  return selectedProperty;
};

const getSelectedTimeRange = (state: IState): DateFilter => {
  const {
    financials: {
      ledgers: { selectedTimeRange },
    },
  } = state;
  return selectedTimeRange;
};

const getLedgerMetrics = (state: IState): ILedgerMetrics => {
  const {
    financials: {
      ledgers: { ledgerMetrics },
    },
  } = state;
  return ledgerMetrics;
};

const getReminderCategories = (state: IState): Unit[] => {
  const {
    financials: { reminderCategories },
  } = state;
  if (!reminderCategories) return [];
  return ObjectMapper.deserializeArray(Unit, reminderCategories);
};

const getReminderFrequencies = (state: IState): Unit[] => {
  const {
    financials: { reminderFrequencies },
  } = state;
  if (!reminderFrequencies) return [];
  return ObjectMapper.deserializeArray(Unit, reminderFrequencies);
};

const getReminders = (state: IState): Reminder[] => {
  const {
    financials: { reminders },
  } = state;
  if (!reminders || reminders.length < 1) return [];
  const deserializedData = ObjectMapper.deserializeArray(Reminder, reminders);
  return DateUtils.ascendingDateSort(deserializedData, 'nextReminderDate');
};

const getReminderAssets = (state: IState): Asset[] => {
  const {
    financials: { reminderAssets },
  } = state;
  if (!reminderAssets) return [];
  return ObjectMapper.deserializeArray(Asset, reminderAssets);
};

const getCurrentDue = (state: IState): DueItem | null => {
  const {
    financials: { currentDueId, dues },
  } = state;
  if (dues && currentDueId !== -1) {
    return ObjectMapper.deserialize(DueItem, dues.line_items.filter((i) => i.id === currentDueId)[0]);
  }
  return null;
};

const getCurrentReminderId = (state: IState): number => {
  const {
    financials: { currentReminderId },
  } = state;
  return currentReminderId;
};

export const FinancialSelectors = {
  getDues,
  getTransactions,
  getTransactionRecords,
  getTransactionsCount,
  getFinancialLoaders,
  getLedgerData,
  getSelectedCountry,
  getSelectedProperty,
  getSelectedTimeRange,
  getLedgerMetrics,
  getReminderCategories,
  getReminderFrequencies,
  getReminders,
  getReminderAssets,
  getCurrentDue,
  getCurrentReminderId,
};
