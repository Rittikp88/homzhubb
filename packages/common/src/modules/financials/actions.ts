import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { Dues, IDues } from '@homzhub/common/src/domain/models/Dues';
import { FinancialTransactions, IFinancialTransaction } from '@homzhub/common/src/domain/models/FinancialTransactions';
import { IFluxStandardAction, IPaginationPayload } from '@homzhub/common/src/modules/interfaces';
import { ITransactionParams } from '@homzhub/common/src/domain/repositories/interfaces';
import { IProcessPaymentPayload } from '@homzhub/common/src/modules/financials/interfaces';

const actionTypePrefix = 'Financials/';

export const FinancialActionTypes = {
  GET: {
    // Transactions
    TRANSACTIONS: `${actionTypePrefix}TRANSACTIONS`,
    TRANSACTIONS_SUCCESS: `${actionTypePrefix}TRANSACTIONS_SUCCESS`,
    TRANSACTIONS_FAILURE: `${actionTypePrefix}TRANSACTIONS_FAILURE`,
    // Dues
    DUES: `${actionTypePrefix}DUES`,
    DUES_SUCCESS: `${actionTypePrefix}DUES_SUCCESS`,
    DUES_FAILURE: `${actionTypePrefix}DUES_FAILURE`,
  },
  POST: {
    PAYMENT: `${actionTypePrefix}PAYMENT`,
    PAYMENT_SUCCESS: `${actionTypePrefix}PAYMENT_SUCCESS`,
    PAYMENT_FAILURE: `${actionTypePrefix}PAYMENT_FAILURE`,
  },
  CLEAR_STATE: `${actionTypePrefix}CLEAR_STATE`,
};

const getTransactions = (payload: ITransactionParams): IFluxStandardAction<ITransactionParams> => ({
  type: FinancialActionTypes.GET.TRANSACTIONS,
  payload,
});

const getTransactionsSuccess = (
  payload: IPaginationPayload<FinancialTransactions>
): IFluxStandardAction<IPaginationPayload<IFinancialTransaction>> => ({
  type: FinancialActionTypes.GET.TRANSACTIONS_SUCCESS,
  payload: { data: ObjectMapper.serialize(payload.data), isReset: payload.isReset },
});

const getTransactionsFailure = (): IFluxStandardAction => ({
  type: FinancialActionTypes.GET.TRANSACTIONS_FAILURE,
});

const getDues = (): IFluxStandardAction => ({
  type: FinancialActionTypes.GET.DUES,
});

const getDuesSuccess = (payload: Dues): IFluxStandardAction<IDues> => ({
  type: FinancialActionTypes.GET.DUES_SUCCESS,
  payload: ObjectMapper.serialize(payload),
});

const getDuesFailure = (): IFluxStandardAction => ({
  type: FinancialActionTypes.GET.DUES_FAILURE,
});

const processPayment = (payload: IProcessPaymentPayload): IFluxStandardAction<IProcessPaymentPayload> => ({
  type: FinancialActionTypes.POST.PAYMENT,
  payload,
});

const paymentSuccess = (): IFluxStandardAction => ({
  type: FinancialActionTypes.POST.PAYMENT_SUCCESS,
});

const paymentFailure = (): IFluxStandardAction => ({
  type: FinancialActionTypes.POST.PAYMENT_FAILURE,
});

const clearFinancials = (): IFluxStandardAction => ({
  type: FinancialActionTypes.GET.DUES_FAILURE,
});

export type FinancialActionPayloadTypes = IPaginationPayload<FinancialTransactions> | IDues | IProcessPaymentPayload;

export const FinancialActions = {
  getTransactions,
  getTransactionsFailure,
  getTransactionsSuccess,
  getDues,
  getDuesFailure,
  getDuesSuccess,
  processPayment,
  paymentSuccess,
  paymentFailure,
  clearFinancials,
};
