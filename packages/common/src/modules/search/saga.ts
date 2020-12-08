/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { call, put, takeEvery, debounce } from '@redux-saga/core/effects';
import { select } from 'redux-saga/effects';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { SearchRepository } from '@homzhub/common/src/domain/repositories/SearchRepository';
import { AssetService } from '@homzhub/common/src/services/AssetService';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { SearchActions, SearchActionTypes } from '@homzhub/common/src/modules/search/actions';
import { SearchSelector } from '@homzhub/common/src/modules/search/selectors';
import { IFilter } from '@homzhub/common/src/domain/models/Search';

export function* getFilterDetails(action: IFluxStandardAction<IFilter>) {
  try {
    const data = yield call(SearchRepository.getFilterDetails, action.payload as IFilter);
    yield put(SearchActions.getFilterDetailsSuccess(data));
  } catch (e) {
    const error = ErrorUtils.getErrorMessage(e.details);
    AlertHelper.error({ message: error });
    yield put(SearchActions.getFilterDetailsFailure(error));
  }
}

export function* getPropertiesDetails() {
  try {
    const assetFilters = yield select(SearchSelector.getFilters);
    const filter = AssetService.constructAssetSearchPayload(assetFilters);
    if (assetFilters.asset_transaction_type === 0) {
      // RENT FLOW
      const data = yield call(SearchRepository.getPropertiesForLeaseListings, filter);
      yield put(SearchActions.getPropertiesSuccess(data));
    } else {
      // SALE FLOW
      const data = yield call(SearchRepository.getPropertiesForSaleListings, filter);
      yield put(SearchActions.getPropertiesSuccess(data));
    }
  } catch (e) {
    const error = ErrorUtils.getErrorMessage(e.details);
    AlertHelper.error({ message: error });
    yield put(SearchActions.getPropertiesFailure(error));
  }
}

export function* getPropertiesListViewDetails() {
  try {
    const assetFilters = yield select(SearchSelector.getFilters);
    const filter = AssetService.constructAssetSearchPayload(assetFilters);
    if (assetFilters.asset_transaction_type === 0) {
      // RENT FLOW
      const data = yield call(SearchRepository.getPropertiesForLeaseListings, filter);
      yield put(SearchActions.getPropertiesListViewSuccess(data));
    } else {
      // SALE FLOW
      const data = yield call(SearchRepository.getPropertiesForSaleListings, filter);
      yield put(SearchActions.getPropertiesListViewSuccess(data));
    }
  } catch (e) {
    const error = ErrorUtils.getErrorMessage(e.details);
    AlertHelper.error({ message: error });
    yield put(SearchActions.getPropertiesListViewFailure(error));
  }
}

export function* watchSearch() {
  yield takeEvery(SearchActionTypes.GET.FILTER_DETAILS, getFilterDetails);
  yield debounce(100, SearchActionTypes.GET.PROPERTIES, getPropertiesDetails);
  yield debounce(100, SearchActionTypes.GET.PROPERTIES_LIST_VIEW, getPropertiesListViewDetails);
}
