import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { Dues } from '@homzhub/common/src/domain/models/Dues';
import { FinancialRecords, FinancialTransactions } from '@homzhub/common/src/domain/models/FinancialTransactions';
import { GeneralLedgers } from '@homzhub/common/src/domain/models/GeneralLedgers';
import { DateFilter } from '@homzhub/common/src/constants/FinanceOverview';
import { IFinancialState, ILedgerMetrics } from '@homzhub/common/src/modules/financials/interfaces';
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
};
