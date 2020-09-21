/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { call, put, takeEvery } from '@redux-saga/core/effects';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { PropertyActions, PropertyActionTypes } from '@homzhub/common/src/modules/property/actions';

export function* getPropertyDetails() {
  try {
    const data = yield call(AssetRepository.getAssetGroups);
    yield put(PropertyActions.getPropertyDetailsSuccess(data));
  } catch (e) {
    const error = ErrorUtils.getErrorMessage(e.details);
    AlertHelper.error({ message: error });
    yield put(PropertyActions.getPropertyDetailsFailure(error));
  }
}

export function* watchProperty() {
  yield takeEvery(PropertyActionTypes.GET.PROPERTY_DETAILS, getPropertyDetails);
}
