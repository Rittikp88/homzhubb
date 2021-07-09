/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { call, put, takeLatest } from '@redux-saga/core/effects';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { LedgerRepository } from '@homzhub/common/src/domain/repositories/LedgerRepository';
import { PaymentRepository } from '@homzhub/common/src/domain/repositories/PaymentRepository';
import { FinancialActions, FinancialActionTypes } from '@homzhub/common/src/modules/financials/actions';
import { Dues } from '@homzhub/common/src/domain/models/Dues';
import { IFluxStandardAction, VoidGenerator } from '@homzhub/common/src/modules/interfaces';
import { FinancialTransactions } from '@homzhub/common/src/domain/models/FinancialTransactions';
import { ITransactionParams } from '@homzhub/common/src/domain/repositories/interfaces';
import { IProcessPaymentPayload } from '@homzhub/common/src/modules/financials/interfaces';

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

export function* watchFinancials() {
  yield takeLatest(FinancialActionTypes.GET.TRANSACTIONS, getTransactions);
  yield takeLatest(FinancialActionTypes.GET.DUES, getAllDues);
  yield takeLatest(FinancialActionTypes.POST.PAYMENT, processPayment);
}
