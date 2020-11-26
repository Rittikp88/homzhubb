/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { call, put, takeEvery, takeLatest } from '@redux-saga/core/effects';
import { select } from 'redux-saga/effects';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { CommonRepository } from '@homzhub/common/src/domain/repositories/CommonRepository';
import { RecordAssetRepository } from '@homzhub/common/src/domain/repositories/RecordAssetRepository';
import { ServiceRepository } from '@homzhub/common/src/domain/repositories/ServiceRepository';
import { RecordAssetActions, RecordAssetActionTypes } from '@homzhub/common/src/modules/recordAsset/actions';
import { RecordAssetSelectors } from '@homzhub/common/src/modules/recordAsset/selectors';

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

export function* getAssetById() {
  try {
    const assetId = yield select(RecordAssetSelectors.getCurrentAssetId);
    const data = yield call(AssetRepository.getAssetById, assetId);
    yield put(RecordAssetActions.getAssetByIdSuccess(data));
  } catch (e) {
    const error = ErrorUtils.getErrorMessage(e.details);
    AlertHelper.error({ message: error });
    yield put(RecordAssetActions.getAssetByIdFailure(error));
  }
}

export function* getMaintenanceUnits() {
  try {
    const data = yield call(CommonRepository.getMaintenanceUnits);
    yield put(RecordAssetActions.getMaintenanceUnitsSuccess(data));
  } catch (e) {
    const error = ErrorUtils.getErrorMessage(e.details);
    AlertHelper.error({ message: error });
  }
}

export function* getValueAddedServices() {
  try {
    const assetGroupId = yield select(RecordAssetSelectors.getAssetGroupId);
    const countryId = yield select(RecordAssetSelectors.getCountryId);
    const city = yield select(RecordAssetSelectors.getCity);
    const data = yield call(RecordAssetRepository.getValueAddedServices, assetGroupId, countryId, city);
    yield put(RecordAssetActions.getValueAddedServicesSuccess(data));
  } catch (e) {
    const error = ErrorUtils.getErrorMessage(e.details);
    AlertHelper.error({ message: error });
  }
}

export function* watchRecordAsset() {
  yield takeEvery(RecordAssetActionTypes.GET.ASSET_PLAN_LIST, getAssetPlanList);
  yield takeEvery(RecordAssetActionTypes.GET.ASSET_GROUPS, getAssetGroups);
  yield takeEvery(RecordAssetActionTypes.GET.ASSET_BY_ID, getAssetById);
  yield takeLatest(RecordAssetActionTypes.GET.MAINTENANCE_UNITS, getMaintenanceUnits);
  yield takeLatest(RecordAssetActionTypes.GET.VALUE_ADDED_SERVICES, getValueAddedServices);
}
