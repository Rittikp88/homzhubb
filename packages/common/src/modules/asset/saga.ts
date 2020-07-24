/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { put, takeEvery, call } from 'redux-saga/effects';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { AssetActions, AssetActionTypes } from '@homzhub/common/src/modules/asset/actions';

function* getAssetReviews(action: IFluxStandardAction<number>) {
  try {
    const response = yield call(AssetRepository.getRatings, action.payload as number);
    yield put(AssetActions.getAssetReviewsSuccess(response));
  } catch (err) {
    yield put(AssetActions.getAssetReviewsFailure(err.message));
  }
}

export function* watchAsset() {
  yield takeEvery(AssetActionTypes.GET.REVIEWS, getAssetReviews);
}
