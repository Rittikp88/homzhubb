/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { put, takeEvery, call } from '@redux-saga/core/effects';
import { select } from 'redux-saga/effects';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { AssetActions, AssetActionTypes } from '@homzhub/common/src/modules/asset/actions';
import { SearchSelector } from '@homzhub/common/src/modules/search/selectors';
import { IGetAssetPayload, IGetDocumentPayload } from '@homzhub/common/src/modules/asset/interfaces';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { IAssetVisitPayload } from '@homzhub/common/src/domain/repositories/interfaces';

function* getAssetReviews(action: IFluxStandardAction<number>) {
  try {
    const response = yield call(AssetRepository.getRatings, action.payload as number);
    yield put(AssetActions.getAssetReviewsSuccess(response));
  } catch (err) {
    const error = ErrorUtils.getErrorMessage(err.details);
    AlertHelper.error({ message: error });
    yield put(AssetActions.getAssetReviewsFailure(err.message));
  }
}

function* getAssetDetails(action: IFluxStandardAction<IGetAssetPayload>) {
  if (action.payload) {
    const { propertyTermId, onCallback } = action.payload;
    // TODO: Find a better way of doing this api call
    try {
      const { asset_transaction_type } = yield select(SearchSelector.getFilters);
      if (asset_transaction_type === 0) {
        // RENT FLOW
        const response = yield call(AssetRepository.getLeaseListing, propertyTermId);
        yield put(AssetActions.getAssetSuccess(response));
        yield put(AssetActions.getAssetReviews(response.id));
      } else {
        // SALE FLOW
        const response = yield call(AssetRepository.getSaleListing, propertyTermId);
        yield put(AssetActions.getAssetSuccess(response));
        yield put(AssetActions.getAssetReviews(response.id));
      }
      if (onCallback) onCallback({ status: true });
    } catch (err) {
      if (onCallback) onCallback({ status: false });
      const error = ErrorUtils.getErrorMessage(err.details);
      AlertHelper.error({ message: error });
      yield put(AssetActions.getAssetFailure(err.message));
    }
  }
}

function* getAssetDocuments(action: IFluxStandardAction<IGetDocumentPayload>) {
  if (action.payload) {
    const { assetId, onCallback } = action.payload;
    try {
      const response = yield call(AssetRepository.getAssetDocument, assetId);
      yield put(AssetActions.getAssetDocumentSuccess(response));
      if (onCallback) {
        onCallback({ status: true });
      }
    } catch (err) {
      if (onCallback) {
        onCallback({ status: false });
      }
      const error = ErrorUtils.getErrorMessage(err.details);
      AlertHelper.error({ message: error });
      yield put(AssetActions.getAssetDocumentFailure(err.message));
    }
  }
}

function* getAssetVisit(action: IFluxStandardAction<IAssetVisitPayload>) {
  try {
    const response = yield call(AssetRepository.getPropertyVisit, action.payload as IAssetVisitPayload);
    yield put(AssetActions.getAssetVisitSuccess(response));
  } catch (err) {
    const error = ErrorUtils.getErrorMessage(err.details);
    AlertHelper.error({ message: error });
    yield put(AssetActions.getAssetVisitFailure(err.message));
  }
}

export function* watchAsset() {
  yield takeEvery(AssetActionTypes.GET.ASSET, getAssetDetails);
  yield takeEvery(AssetActionTypes.GET.REVIEWS, getAssetReviews);
  yield takeEvery(AssetActionTypes.GET.ASSET_DOCUMENT, getAssetDocuments);
  yield takeEvery(AssetActionTypes.GET.ASSET_VISIT, getAssetVisit);
}
