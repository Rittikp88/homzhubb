/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { put, takeEvery, call } from '@redux-saga/core/effects';
import { select } from 'redux-saga/effects';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { AssetActions, AssetActionTypes } from '@homzhub/common/src/modules/asset/actions';
import { SearchSelector } from '@homzhub/common/src/modules/search/selectors';

function* getAssetReviews(action: IFluxStandardAction<number>) {
  try {
    const response = yield call(AssetRepository.getRatings, action.payload as number);
    yield put(AssetActions.getAssetReviewsSuccess(response));
  } catch (err) {
    yield put(AssetActions.getAssetReviewsFailure(err.message));
  }
}

function* getAssetDetails(action: IFluxStandardAction<number>) {
  // TODO: Find a better way of doing this api call
  try {
    const { asset_transaction_type } = yield select(SearchSelector.getFilters);
    if (asset_transaction_type === 0) {
      // RENT FLOW
      const response = yield call(AssetRepository.getLeaseListing, action.payload as number);
      yield put(AssetActions.getAssetSuccess(response));
    } else {
      // SALE FLOW
      const response = yield call(AssetRepository.getSaleListing, action.payload as number);
      yield put(AssetActions.getAssetSuccess(response));
    }
  } catch (err) {
    yield put(AssetActions.getAssetFailure(err.message));
  }
}

export function* watchAsset() {
  yield takeEvery(AssetActionTypes.GET.ASSET, getAssetDetails);
  yield takeEvery(AssetActionTypes.GET.REVIEWS, getAssetReviews);
}
