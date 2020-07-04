/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { call, put, takeEvery } from '@redux-saga/core/effects';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { PropertyActions, PropertyActionTypes } from '@homzhub/common/src/modules/property/actions';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { ServiceRepository } from '@homzhub/common/src/domain/repositories/ServiceRepository';
import { IServiceListStepsPayload } from '@homzhub/common/src/domain/models/Service';

export function* getPropertyDetails() {
  try {
    const data = yield call(AssetRepository.getDetails);
    yield put(PropertyActions.getPropertyDetailsSuccess(data));
  } catch (e) {
    yield put(PropertyActions.getPropertyDetailsFailure(e.message));
  }
}

export function* getRentServicesList() {
  try {
    const data = yield call(ServiceRepository.getRentServices);
    yield put(PropertyActions.getRentServiceListSuccess(data));
  } catch (e) {
    yield put(PropertyActions.getRentServiceListFailure(e.message));
  }
}

export function* getServiceDetails(action: IFluxStandardAction<number>) {
  const { payload } = action;
  try {
    const data = yield call(ServiceRepository.getServiceDetail, payload as number);
    yield put(PropertyActions.getServiceDetailsSuccess(data));
  } catch (e) {
    yield put(PropertyActions.getServiceDetailsFailure(e.message));
  }
}

export function* getServiceStepsDetails(action: IFluxStandardAction<IServiceListStepsPayload>) {
  const { payload } = action;
  try {
    // @ts-ignore
    const data = yield call(ServiceRepository.getServiceStepsDetails, payload.serviceCategoryId, payload.serviceId);
    yield put(PropertyActions.getServiceStepsDetailsSuccess(data));
  } catch (e) {
    yield put(PropertyActions.getServiceStepsDetailsFailure(e.message));
  }
}

export function* watchProperty() {
  yield takeEvery(PropertyActionTypes.GET.PROPERTY_DETAILS, getPropertyDetails);
  yield takeEvery(PropertyActionTypes.GET.RENT_SERVICE_LIST, getRentServicesList);
  yield takeEvery(PropertyActionTypes.GET.SERVICE_DETAILS, getServiceDetails);
  yield takeEvery(PropertyActionTypes.GET.SERVICE_STEPS, getServiceStepsDetails);
}
