/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { call, put, takeEvery } from '@redux-saga/core/effects';
import { PropertyRepository } from '@homzhub/common/src/domain/repositories/PropertyRepository';
import { PropertyActions, PropertyActionTypes } from '@homzhub/common/src/modules/property/actions';

function* getPropertyDetails() {
  try {
    const data = yield call(PropertyRepository.getDetails);
    // TODO: check if data has array of objects and then fire by id call for space available
    yield put(PropertyActions.getPropertyDetailsSuccess(data));
  } catch (e) {
    yield put(PropertyActions.getPropertyDetailsFailure(e.message));
  }
}

// function* getPropertyDetailsById(action: IFluxStandardAction) {
//   const { payload } = action;
//   try {
//     const data = yield call(PropertyRepository.getDetailsById, payload);
//     yield put(PropertyActions.getPropertyDetailsByIdSuccess(data));
//   } catch (e) {
//     yield put(PropertyActions.getPropertyDetailsByIdFailure(e.message));
//   }
// }

export function* watchProperty() {
  yield takeEvery(PropertyActionTypes.GET.PROPERTY_DETAILS, getPropertyDetails);
  // yield takeEvery(PropertyActionTypes.GET.PROPERTY_DETAILS_BY_ID, getPropertyDetailsById);
}
