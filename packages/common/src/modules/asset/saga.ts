/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { put, takeEvery, call, takeLatest } from '@redux-saga/core/effects';
import { select } from 'redux-saga/effects';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { AssetActions, AssetActionTypes } from '@homzhub/common/src/modules/asset/actions';
import { SearchSelector } from '@homzhub/common/src/modules/search/selectors';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { IAssetVisitPayload, IGetListingReviews } from '@homzhub/common/src/domain/repositories/interfaces';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { IGetAssetPayload, IGetDocumentPayload } from '@homzhub/common/src/modules/asset/interfaces';

function* getAssetReviews(action: IFluxStandardAction<IGetListingReviews>) {
  try {
    const response = yield call(AssetRepository.getListingReviewsSummary, action.payload as IGetListingReviews);
    yield put(AssetActions.getAssetReviewsSuccess(response));
  } catch (err) {
    yield put(AssetActions.getAssetReviewsFailure(err.message));
  }
}

function* getAssetDetails(action: IFluxStandardAction<IGetAssetPayload>) {
  if (action.payload) {
    const { propertyTermId, onCallback } = action.payload;
    let response: Asset;
    let reviewParams;
    try {
      const { asset_transaction_type } = yield select(SearchSelector.getFilters);
      if (asset_transaction_type === 0) {
        // RENT FLOW
        response = yield call(AssetRepository.getLeaseListing, propertyTermId);
        reviewParams = { lease_listing: response.leaseTerm?.id };
      } else {
        // SALE FLOW
        response = yield call(AssetRepository.getSaleListing, propertyTermId);
        reviewParams = { sale_listing: response.saleTerm?.id };
      }

      yield put(AssetActions.getAssetSuccess(response));
      yield put(AssetActions.getAssetReviews(reviewParams));

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

export function* getUserActiveAssets() {
  try {
    const response = yield call(AssetRepository.getActiveAssets);
    yield put(AssetActions.getActiveAssetsSuccess(response));
  } catch (e) {
    const error = ErrorUtils.getErrorMessage(e.details);
    AlertHelper.error({ message: error });
  }
}

export function* watchAsset() {
  yield takeEvery(AssetActionTypes.GET.ASSET, getAssetDetails);
  yield takeEvery(AssetActionTypes.GET.REVIEWS, getAssetReviews);
  yield takeEvery(AssetActionTypes.GET.ASSET_DOCUMENT, getAssetDocuments);
  yield takeLatest(AssetActionTypes.GET.ASSET_VISIT, getAssetVisit);
  yield takeEvery(AssetActionTypes.GET.USER_ACTIVE_ASSETS, getUserActiveAssets);
}
