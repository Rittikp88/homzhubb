/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { call, put, takeEvery } from '@redux-saga/core/effects';
import { PropertyRepository } from '@homzhub/common/src/domain/repositories/PropertyRepository';
import { PropertyActions, PropertyActionTypes } from '@homzhub/common/src/modules/property/actions';

function* getPropertyDetails() {
  try {
    const data = yield call(PropertyRepository.getDetails);
    yield put(PropertyActions.getPropertyDetailsSuccess(data));
  } catch (e) {
    yield put(PropertyActions.getPropertyDetailsFailure(e.message));
  }
}

export function* watchProperty() {
  yield takeEvery(PropertyActionTypes.GET.PROPERTY_DETAILS, getPropertyDetails);
}
