import { ReducerUtils } from '@homzhub/common/src/utils/ReducerUtils';
import { FinancialActionPayloadTypes, FinancialActionTypes } from '@homzhub/common/src/modules/financials/actions';
import { IDues } from '@homzhub/common/src/domain/models/Dues';
import { IFinancialTransaction } from '@homzhub/common/src/domain/models/FinancialTransactions';
import { IFinancialState } from '@homzhub/common/src/modules/financials/interfaces';
import { IFluxStandardAction, IPaginationPayload } from '@homzhub/common/src/modules/interfaces';

export const initialFinancialsState: IFinancialState = {
  transactions: null,
  dues: null,
  loaders: {
    transactions: false,
    dues: false,
    payment: false,
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
    case FinancialActionTypes.CLEAR_STATE:
      return initialFinancialsState;

    default:
      return {
        ...state,
      };
  }
};
