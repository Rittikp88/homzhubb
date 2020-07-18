/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { call, put, takeEvery } from '@redux-saga/core/effects';
import { SearchRepository } from '@homzhub/common/src/domain/repositories/SearchRepository';
import { SearchActions, SearchActionTypes } from '@homzhub/common/src/modules/search/actions';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';

export function* getFilterDetails(action: IFluxStandardAction<any>) {
  try {
    const data = yield call(SearchRepository.getFilterDetails, action.payload);
    yield put(SearchActions.getFilterDetailsSuccess(data));
  } catch (e) {
    yield put(SearchActions.getFilterDetailsFailure(e.message));
  }
}

export function* watchSearch() {
  yield takeEvery(SearchActionTypes.GET.FILTER_DETAILS, getFilterDetails);
}
