/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { call, put, takeLatest, select } from '@redux-saga/core/effects';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FinanceUtils, IFinancialYear, IGeneralLedgersParams } from '@homzhub/common/src/utils/FinanceUtil';
import { LedgerUtils } from '@homzhub/common/src/utils/LedgerUtils';
import { StoreProviderService } from '@homzhub/common/src/services/StoreProviderService';
import { LedgerRepository } from '@homzhub/common/src/domain/repositories/LedgerRepository';
import { PaymentRepository } from '@homzhub/common/src/domain/repositories/PaymentRepository';
import { FinancialActions, FinancialActionTypes } from '@homzhub/common/src/modules/financials/actions';
import { FinancialSelectors } from '@homzhub/common/src/modules/financials/selectors';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { DataGroupBy, GeneralLedgers, LedgerTypes } from '@homzhub/common/src/domain/models/GeneralLedgers';
import { Dues } from '@homzhub/common/src/domain/models/Dues';
import { IFluxStandardAction, VoidGenerator } from '@homzhub/common/src/modules/interfaces';
import { FinancialTransactions } from '@homzhub/common/src/domain/models/FinancialTransactions';
import { ITransactionParams } from '@homzhub/common/src/domain/repositories/interfaces';
import { ILedgerMetrics, IProcessPaymentPayload } from '@homzhub/common/src/modules/financials/interfaces';

export function* getTransactions(action: IFluxStandardAction<ITransactionParams>): VoidGenerator {
  try {
    const response = yield call(LedgerRepository.getGeneralLedgers, action.payload as ITransactionParams);
    yield put(
      FinancialActions.getTransactionsSuccess({
        data: response as FinancialTransactions,
        isReset: action.payload?.offset === 0,
      })
    );
  } catch (e) {
    yield put(FinancialActions.getTransactionsFailure());
    AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
  }
}

export function* getAllDues(): VoidGenerator {
  try {
    const response = yield call(LedgerRepository.getDues);
    yield put(FinancialActions.getDuesSuccess(response as Dues));
  } catch (e) {
    yield put(FinancialActions.getDuesFailure());
    AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
  }
}

export function* processPayment(action: IFluxStandardAction<IProcessPaymentPayload>): VoidGenerator {
  if (!action.payload) return;
  const { data, onCallback } = action.payload;
  try {
    yield call(PaymentRepository.processPayment, data);
    yield put(FinancialActions.paymentSuccess());
    if (onCallback) {
      onCallback(true);
    }
  } catch (e) {
    if (onCallback) {
      onCallback(false);
    }
    yield put(FinancialActions.paymentFailure());
    AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
  }
}

// Todo (Praharsh) : Refactor financeUtil logic
export function* getLedgers(): VoidGenerator {
  try {
    const selectedTimeRange: number = yield select(FinancialSelectors.getSelectedTimeRange);
    const financialYear: IFinancialYear = yield select(UserSelector.getUserFinancialYear);
    const selectedCountry: number = yield select(FinancialSelectors.getSelectedCountry);
    const selectedProperty: number = yield select(FinancialSelectors.getSelectedProperty);

    const params: IGeneralLedgersParams = {
      selectedTimeRange,
      selectedCountry,
      selectedProperty,
      financialYear,
    };

    const store = StoreProviderService.getStore();

    const successCallback = (response: GeneralLedgers[]): void => {
      store.dispatch(FinancialActions.getLedgersSuccess(response));
    };

    const failureCallback = (error: any): void => {
      store.dispatch(FinancialActions.getLedgersFailure());
      AlertHelper.error({ message: `${error}` });
    };

    yield call(FinanceUtils.getGeneralLedgers, params, successCallback, failureCallback);
  } catch (e) {
    yield put(FinancialActions.getLedgersFailure());
    AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
  }
}

export function* getLedgerMetrics() {
  try {
    const payload = {
      transaction_date__gte: DateUtils.getCurrentYearStartDate(),
      transaction_date__lte: DateUtils.getCurrentYearLastDate(),
      transaction_date_group_by: DataGroupBy.year,
    };
    const ledgerData: GeneralLedgers[] = yield call(LedgerRepository.getLedgerPerformances, payload);
    const metricsData: ILedgerMetrics = {
      income: `${LedgerUtils.totalByType(LedgerTypes.credit, ledgerData)}`,
      expense: `${LedgerUtils.totalByType(LedgerTypes.debit, ledgerData)}`,
    };
    yield put(FinancialActions.getLedgerMetricsSuccess(metricsData));
  } catch (err) {
    yield put(FinancialActions.getLedgerMetricsFailure());
    AlertHelper.error({ message: ErrorUtils.getErrorMessage(err.details), statusCode: err.details.statusCode });
  }
}

export function* watchFinancials() {
  yield takeLatest(FinancialActionTypes.GET.TRANSACTIONS, getTransactions);
  yield takeLatest(FinancialActionTypes.GET.DUES, getAllDues);
  yield takeLatest(FinancialActionTypes.POST.PAYMENT, processPayment);
  yield takeLatest(FinancialActionTypes.GET.LEDGERS, getLedgers);
  yield takeLatest(FinancialActionTypes.GET.LEDGER_METRICS, getLedgerMetrics);
}
