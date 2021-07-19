import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { Dues, IDues } from '@homzhub/common/src/domain/models/Dues';
import { FinancialTransactions, IFinancialTransaction } from '@homzhub/common/src/domain/models/FinancialTransactions';
import { GeneralLedgers, IGeneralLedgers } from '@homzhub/common/src/domain/models/GeneralLedgers';
import { DateFilter } from '@homzhub/common/src/constants/FinanceOverview';
import { IFluxStandardAction, IPaginationPayload } from '@homzhub/common/src/modules/interfaces';
import { ITransactionParams } from '@homzhub/common/src/domain/repositories/interfaces';
import { ILedgerMetrics, IProcessPaymentPayload } from '@homzhub/common/src/modules/financials/interfaces';

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
    // LedgerData
    LEDGERS: `${actionTypePrefix}LEDGERS`,
    LEDGERS_SUCCESS: `${actionTypePrefix}LEDGERS_SUCCESS`,
    LEDGERS_FAILURE: `${actionTypePrefix}LEDGERS_FAILURE`,
    // LedgerMetrics
    LEDGER_METRICS: `${actionTypePrefix}LEDGER_METRICS`,
    LEDGER_METRICS_SUCCESS: `${actionTypePrefix}LEDGER_METRICS_SUCCESS`,
    LEDGER_METRICS_FAILURE: `${actionTypePrefix}LEDGER_METRICS_FAILURE`,
  },
  SET: {
    SELECTED_PROPERTY: `${actionTypePrefix}SELECTED_PROPERTY`,
    SELECTED_COUNTRY: `${actionTypePrefix}SELECTED_COUNTRY`,
    SELECTED_TIME_RANGE: `${actionTypePrefix}SELECTED_TIME_RANGE`,
  },
  POST: {
    PAYMENT: `${actionTypePrefix}PAYMENT`,
    PAYMENT_SUCCESS: `${actionTypePrefix}PAYMENT_SUCCESS`,
    PAYMENT_FAILURE: `${actionTypePrefix}PAYMENT_FAILURE`,
  },
  CLEAR_STATE: `${actionTypePrefix}CLEAR_STATE`,
  RESET_LEDGER_FILTERS: `${actionTypePrefix}RESET_LEDGER_FILTERS`,
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
  type: FinancialActionTypes.CLEAR_STATE,
});

const setCurrentProperty = (payload: number): IFluxStandardAction<number> => ({
  type: FinancialActionTypes.SET.SELECTED_PROPERTY,
  payload,
});

const setCurrentCountry = (payload: number): IFluxStandardAction<number> => ({
  type: FinancialActionTypes.SET.SELECTED_COUNTRY,
  payload,
});

const setTimeRange = (payload: DateFilter): IFluxStandardAction<DateFilter> => ({
  type: FinancialActionTypes.SET.SELECTED_TIME_RANGE,
  payload,
});

const getLedgers = (): IFluxStandardAction => ({
  type: FinancialActionTypes.GET.LEDGERS,
});

const getLedgersSuccess = (payload: GeneralLedgers[]): IFluxStandardAction<IGeneralLedgers[]> => ({
  type: FinancialActionTypes.GET.LEDGERS_SUCCESS,
  payload: ObjectMapper.serializeArray(payload),
});

const getLedgersFailure = (): IFluxStandardAction => ({
  type: FinancialActionTypes.GET.LEDGERS_FAILURE,
});

const getLedgerMetrics = (): IFluxStandardAction<IGeneralLedgers[]> => ({
  type: FinancialActionTypes.GET.LEDGER_METRICS,
});

const getLedgerMetricsSuccess = (payload: ILedgerMetrics): IFluxStandardAction<ILedgerMetrics> => ({
  type: FinancialActionTypes.GET.LEDGER_METRICS_SUCCESS,
  payload,
});

const getLedgerMetricsFailure = (): IFluxStandardAction => ({
  type: FinancialActionTypes.GET.LEDGER_METRICS_FAILURE,
});

const resetLedgerFilters = (): IFluxStandardAction => ({
  type: FinancialActionTypes.RESET_LEDGER_FILTERS,
});

export type FinancialActionPayloadTypes =
  | IPaginationPayload<FinancialTransactions>
  | IDues
  | IProcessPaymentPayload
  | IGeneralLedgers[]
  | number
  | DateFilter
  | ILedgerMetrics;

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
  getLedgers,
  getLedgersSuccess,
  getLedgersFailure,
  setCurrentProperty,
  setCurrentCountry,
  setTimeRange,
  getLedgerMetrics,
  getLedgerMetricsSuccess,
  getLedgerMetricsFailure,
  resetLedgerFilters,
};
