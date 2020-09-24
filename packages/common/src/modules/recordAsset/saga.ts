/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { call, put, takeEvery } from '@redux-saga/core/effects';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { ServiceRepository } from '@homzhub/common/src/domain/repositories/ServiceRepository';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { RecordAssetActions, RecordAssetActionTypes } from '@homzhub/common/src/modules/recordAsset/actions';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';

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

export function* getAssetGroups() {
  try {
    const data = yield call(AssetRepository.getAssetGroups);
    yield put(RecordAssetActions.getAssetGroupsSuccess(data));
  } catch (e) {
    const error = ErrorUtils.getErrorMessage(e.details);
    AlertHelper.error({ message: error });
    yield put(RecordAssetActions.getAssetGroupsFailure(error));
  }
}

export function* getAssetById(action: IFluxStandardAction<number>) {
  const { payload } = action;

  try {
    const data = yield call(AssetRepository.getAssetById, payload as number);
    yield put(RecordAssetActions.getAssetByIdSuccess(data));
  } catch (e) {
    const error = ErrorUtils.getErrorMessage(e.details);
    AlertHelper.error({ message: error });
    yield put(RecordAssetActions.getAssetByIdFailure(error));
  }
}

export function* watchRecordAsset() {
  yield takeEvery(RecordAssetActionTypes.GET.ASSET_PLAN_LIST, getAssetPlanList);
  yield takeEvery(RecordAssetActionTypes.GET.ASSET_GROUPS, getAssetGroups);
  yield takeEvery(RecordAssetActionTypes.GET.ASSET_BY_ID, getAssetById);
}
