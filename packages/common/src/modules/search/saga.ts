/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { call, put, takeEvery } from '@redux-saga/core/effects';
import { select } from 'redux-saga/effects';
import { SearchRepository } from '@homzhub/common/src/domain/repositories/SearchRepository';
import { SearchActions, SearchActionTypes } from '@homzhub/common/src/modules/search/actions';
import { IFluxStandardAction, IState } from '@homzhub/common/src/modules/interfaces';
import { AssetService } from '../../services/AssetService';

const getFilters = (state: IState) => state.search.filter;

export function* getFilterDetails(action: IFluxStandardAction<any>) {
  try {
    const data = yield call(SearchRepository.getFilterDetails, action.payload);
    yield put(SearchActions.getFilterDetailsSuccess(data));
  } catch (e) {
    yield put(SearchActions.getFilterDetailsFailure(e.message));
  }
}

export function* getPropertiesDetails() {
  try {
    const filter = AssetService.constructAssetSearchPayload(yield select(getFilters));
    const data = yield call(SearchRepository.getProperties, filter);
    yield put(SearchActions.getPropertiesSuccess(data));
  } catch (e) {
    yield put(SearchActions.getPropertiesFailure(e.message));
  }
}

export function* watchSearch() {
  yield takeEvery(SearchActionTypes.GET.FILTER_DETAILS, getFilterDetails);
  yield takeEvery(SearchActionTypes.GET.PROPERTIES, getPropertiesDetails);
}
