import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { IDropdownOption } from '@homzhub/common/src/components/molecules/FormDropdown';
import { Amount } from '@homzhub/common/src/domain/models/Amount';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { DueItem } from '@homzhub/common/src/domain/models/DueItem';
import { Dues } from '@homzhub/common/src/domain/models/Dues';
import { FinancialRecords, FinancialTransactions } from '@homzhub/common/src/domain/models/FinancialTransactions';
import { GeneralLedgers } from '@homzhub/common/src/domain/models/GeneralLedgers';
import { Reminder } from '@homzhub/common/src/domain/models/Reminder';
import { Unit } from '@homzhub/common/src/domain/models/Unit';
import { DateFilter } from '@homzhub/common/src/constants/FinanceOverview';
import { IFinancialState, ILedgerMetrics, IReminderFormData } from '@homzhub/common/src/modules/financials/interfaces';
import { IState } from '@homzhub/common/src/modules/interfaces';

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

const getDueItems = (state: IState): DueItem[] => {
  const {
    financials: { dues },
  } = state;
  if (!dues) return [];
  const deserialisedData = ObjectMapper.deserializeArray(DueItem, dues.line_items);
  return DateUtils.descendingDateSort(deserialisedData, 'createdAt');
};

const getTotalDueAmount = (state: IState): Amount => {
  const {
    financials: { dues },
  } = state;
  if (dues?.total) {
    return ObjectMapper.deserialize(Amount, dues?.total);
  }
  return new Amount();
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

const getCategoriesDropdown = (state: IState): IDropdownOption[] => {
  const categories = getReminderCategories(state);
  if (categories.length < 1) return [];
  return categories.map((item) => {
    return {
      label: item.name,
      value: item.id,
    };
  });
};

const getReminderFrequencies = (state: IState): Unit[] => {
  const {
    financials: { reminderFrequencies },
  } = state;
  if (!reminderFrequencies) return [];
  return ObjectMapper.deserializeArray(Unit, reminderFrequencies);
};

const getFrequenciesDropdown = (state: IState): IDropdownOption[] => {
  const frequencies = getReminderFrequencies(state);
  if (frequencies.length < 1) return [];
  return frequencies.map((item) => {
    return {
      label: item.name,
      value: item.id,
    };
  });
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

const getReminderFormData = (state: IState): IReminderFormData => {
  const {
    financials: { reminderFormData },
  } = state;
  return reminderFormData;
};

export const FinancialSelectors = {
  getDues,
  getDueItems,
  getTotalDueAmount,
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
  getReminderFormData,
  getCategoriesDropdown,
  getFrequenciesDropdown,
};
