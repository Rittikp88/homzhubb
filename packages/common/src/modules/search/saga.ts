/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { call, put, takeEvery, debounce } from '@redux-saga/core/effects';
import { select } from 'redux-saga/effects';
import { IFluxStandardAction, IState } from '@homzhub/common/src/modules/interfaces';
import { SearchActions, SearchActionTypes } from '@homzhub/common/src/modules/search/actions';
import { AssetService } from '@homzhub/common/src/services/AssetService';
import { IFilters } from '@homzhub/common/src/domain/models/Search';
import { SearchRepository } from '@homzhub/common/src/domain/repositories/SearchRepository';

const getFilters = (state: IState) => state.search.filter;

export function* getFilterDetails(action: IFluxStandardAction<IFilters>) {
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

export function* getPropertiesListViewDetails() {
  try {
    const filter = AssetService.constructAssetSearchPayload(yield select(getFilters));
    const data = yield call(SearchRepository.getProperties, filter);
    yield put(SearchActions.getPropertiesListViewSuccess(data));
  } catch (e) {
    yield put(SearchActions.getPropertiesListViewFailure(e.message));
  }
}

export function* watchSearch() {
  yield takeEvery(SearchActionTypes.GET.FILTER_DETAILS, getFilterDetails);
  yield debounce(100, SearchActionTypes.GET.PROPERTIES, getPropertiesDetails);
  yield debounce(100, SearchActionTypes.GET.PROPERTIES_LIST_VIEW, getPropertiesListViewDetails);
}
