/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { put, takeEvery, call } from '@redux-saga/core/effects';
import { select } from 'redux-saga/effects';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { ILeadPayload } from '@homzhub/common/src/domain/repositories/interfaces';
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
      yield put(AssetActions.getAssetReviews(response.id));
    } else {
      // SALE FLOW
      const response = yield call(AssetRepository.getSaleListing, action.payload as number);
      yield put(AssetActions.getAssetSuccess(response));
      yield put(AssetActions.getAssetReviews(response.id));
    }
  } catch (err) {
    yield put(AssetActions.getAssetFailure(err.message));
  }
}

function* postLeadDetail(action: IFluxStandardAction<ILeadPayload>) {
  // TODO: Find a better way of doing this api call
  try {
    const { asset_transaction_type } = yield select(SearchSelector.getFilters);
    if (asset_transaction_type === 0) {
      // RENT FLOW
      yield call(AssetRepository.postLeaseLeadDetail, action.payload as ILeadPayload);
      yield put(AssetActions.postLeadSuccess());
    } else {
      // SALE FLOW
      yield call(AssetRepository.postSaleLeadDetail, action.payload as ILeadPayload);
      yield put(AssetActions.postLeadSuccess());
    }
  } catch (err) {
    yield put(AssetActions.postLeadFailure(err.message));
  }
}

export function* watchAsset() {
  yield takeEvery(AssetActionTypes.GET.ASSET, getAssetDetails);
  yield takeEvery(AssetActionTypes.GET.REVIEWS, getAssetReviews);
  yield takeEvery(AssetActionTypes.POST.LEAD, postLeadDetail);
}
