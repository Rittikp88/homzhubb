/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { call, put, takeEvery } from '@redux-saga/core/effects';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { ServiceRepository } from '@homzhub/common/src/domain/repositories/ServiceRepository';
import { RecordAssetActions, RecordAssetActionTypes } from '@homzhub/common/src/modules/recordAsset/actions';

export function* getAssetPlanList() {
  try {
    const data = yield call(ServiceRepository.getAssetPlans);
    yield put(RecordAssetActions.getAssetPlanListSuccess(data));
  } catch (e) {
    const error = ErrorUtils.getErrorMessage(e.details);
    AlertHelper.error({ message: error });
    yield put(RecordAssetActions.getAssetPlanListFailure(error));
  }
}

export function* watchRecordAsset() {
  yield takeEvery(RecordAssetActionTypes.GET.ASSET_PLAN_LIST, getAssetPlanList);
}
