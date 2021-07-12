import { ReducerUtils } from '@homzhub/common/src/utils/ReducerUtils';
import { FinancialActionPayloadTypes, FinancialActionTypes } from '@homzhub/common/src/modules/financials/actions';
import { DateFilter } from '@homzhub/common/src/constants/FinanceOverview';
import { IDues } from '@homzhub/common/src/domain/models/Dues';
import { IFinancialTransaction } from '@homzhub/common/src/domain/models/FinancialTransactions';
import { IGeneralLedgers } from '@homzhub/common/src/domain/models/GeneralLedgers';
import { IFinancialState, ILedgerMetrics } from '@homzhub/common/src/modules/financials/interfaces';
import { IFluxStandardAction, IPaginationPayload } from '@homzhub/common/src/modules/interfaces';

const defaultLedgerFilters = {
  selectedProperty: 0,
  selectedCountry: 0,
  selectedTimeRange: DateFilter.thisYear,
};

export const initialFinancialsState: IFinancialState = {
  transactions: null,
  dues: null,
  ledgers: {
    ...defaultLedgerFilters,
    ledgerData: [],
    ledgerMetrics: {
      income: '0',
      expense: '0',
    },
  },
  loaders: {
    transactions: false,
    dues: false,
    payment: false,
    ledgers: false,
  },
};

export const financialsReducer = (
  state: IFinancialState = initialFinancialsState,
  action: IFluxStandardAction<FinancialActionPayloadTypes>
): IFinancialState => {
  switch (action.type) {
    case FinancialActionTypes.GET.TRANSACTIONS:
      return { ...state, ['loaders']: { ...state.loaders, ['transactions']: true } };

    case FinancialActionTypes.GET.TRANSACTIONS_SUCCESS: {
      const payload = action.payload as IPaginationPayload<IFinancialTransaction>;
      const newData = ReducerUtils.formatFinancialTransactions(state.transactions, payload);
      return {
        ...state,
        ['transactions']: newData,
        ['loaders']: { ...state.loaders, ['transactions']: false },
      };
    }

    case FinancialActionTypes.GET.TRANSACTIONS_FAILURE:
      return { ...state, ['loaders']: { ...state.loaders, ['transactions']: false } };
    case FinancialActionTypes.GET.DUES:
      return { ...state, ['loaders']: { ...state.loaders, ['dues']: true } };
    case FinancialActionTypes.GET.DUES_SUCCESS:
      return { ...state, ['dues']: action.payload as IDues, ['loaders']: { ...state.loaders, ['dues']: false } };
    case FinancialActionTypes.GET.DUES_FAILURE:
      return { ...state, ['loaders']: { ...state.loaders, ['dues']: false } };
    case FinancialActionTypes.POST.PAYMENT:
      return { ...state, ['loaders']: { ...state.loaders, ['payment']: true } };
    case FinancialActionTypes.POST.PAYMENT_SUCCESS:
    case FinancialActionTypes.POST.PAYMENT_FAILURE:
      return { ...state, ['loaders']: { ...state.loaders, ['payment']: false } };
    case FinancialActionTypes.SET.SELECTED_COUNTRY:
      return { ...state, ['ledgers']: { ...state.ledgers, ['selectedCountry']: action.payload as number } };
    case FinancialActionTypes.SET.SELECTED_PROPERTY:
      return { ...state, ['ledgers']: { ...state.ledgers, ['selectedProperty']: action.payload as number } };
    case FinancialActionTypes.SET.SELECTED_TIME_RANGE:
      return { ...state, ['ledgers']: { ...state.ledgers, ['selectedTimeRange']: action.payload as number } };
    case FinancialActionTypes.GET.LEDGERS:
      return { ...state, ['loaders']: { ...state.loaders, ['ledgers']: true } };
    case FinancialActionTypes.GET.LEDGERS_SUCCESS:
      return {
        ...state,
        ['ledgers']: { ...state.ledgers, ['ledgerData']: action.payload as IGeneralLedgers[] },
        ['loaders']: { ...state.loaders, ['ledgers']: false },
      };
    case FinancialActionTypes.GET.LEDGER_METRICS:
      return { ...state, ['loaders']: { ...state.loaders, ['ledgers']: true } };
    case FinancialActionTypes.GET.LEDGER_METRICS_SUCCESS:
      return {
        ...state,
        ['ledgers']: { ...state.ledgers, ['ledgerMetrics']: action.payload as ILedgerMetrics },
        ['loaders']: { ...state.loaders, ['ledgers']: false },
      };
    case FinancialActionTypes.GET.LEDGERS_FAILURE:
    case FinancialActionTypes.GET.LEDGER_METRICS_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['ledgers']: false },
      };
    case FinancialActionTypes.RESET_LEDGER_FILTERS:
      return {
        ...state,
        ['ledgers']: { ...state.ledgers, ...defaultLedgerFilters },
      };
    case FinancialActionTypes.CLEAR_STATE:
      return initialFinancialsState;

    default:
      return {
        ...state,
      };
  }
};
