/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { call, put, takeEvery } from '@redux-saga/core/effects';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { SearchActions, SearchActionTypes } from '@homzhub/common/src/modules/search/actions';

export function* getFilterDetails() {
  try {
    const data = yield call(AssetRepository.getFilterDetails);
    yield put(SearchActions.getFilterDetailsSuccess(data));
  } catch (e) {
    yield put(SearchActions.getFilterDetailsFailure(e.message));
  }
}

export function* watchSearch() {
  yield takeEvery(SearchActionTypes.GET.FILTER_DETAILS, getFilterDetails);
}
