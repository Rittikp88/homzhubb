/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { put, takeEvery, call } from '@redux-saga/core/effects';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { ServiceActions, ServiceActionTypes } from '@homzhub/common/src/modules/service/actions';
import { ServiceRepository } from '@homzhub/common/src/domain/repositories/ServiceRepository';
import { IServiceParam } from '@homzhub/common/src/domain/repositories/interfaces';

export function* getServiceDetails(action: IFluxStandardAction<IServiceParam>) {
  try {
    const data = yield call(ServiceRepository.getServiceDetail, action.payload as IServiceParam);
    yield put(ServiceActions.getServiceDetailsSuccess(data));
  } catch (e) {
    yield put(ServiceActions.getServiceDetailsFailure(e.message));
  }
}

export function* getServiceStepsDetails(action: IFluxStandardAction<number>) {
  const { payload } = action;
  try {
    const data = yield call(ServiceRepository.getServiceStepsDetails, payload as number);
    yield put(ServiceActions.getServiceStepsDetailsSuccess(data));
  } catch (e) {
    yield put(ServiceActions.getServiceStepsDetailsFailure(e.message));
  }
}

export function* watchService() {
  yield takeEvery(ServiceActionTypes.GET.SERVICE_DETAILS, getServiceDetails);
  yield takeEvery(ServiceActionTypes.GET.SERVICE_STEPS, getServiceStepsDetails);
}
