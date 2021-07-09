import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { Dues } from '@homzhub/common/src/domain/models/Dues';
import { FinancialRecords, FinancialTransactions } from '@homzhub/common/src/domain/models/FinancialTransactions';
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

const getduesLoader = (state: IState): boolean => {
  const {
    financials: {
      loaders: { dues },
    },
  } = state;
  return dues;
};

export const FinancialSelectors = {
  getDues,
  getTransactions,
  getTransactionRecords,
  getTransactionsCount,
  getduesLoader,
};
