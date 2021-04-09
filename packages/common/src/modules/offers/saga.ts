/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { call, put, takeLatest } from '@redux-saga/core/effects';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { OffersRepository } from '@homzhub/common/src/domain/repositories/OffersRepository';
import { OfferActions, OfferActionTypes } from '@homzhub/common/src/modules/offers/actions';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { INegotiation, ListingType } from '@homzhub/common/src/domain/repositories/interfaces';
import { ICurrentOffer } from '@homzhub/common/src/modules/offers/interfaces';

export function* getListingDetail(action: IFluxStandardAction<ICurrentOffer>) {
  if (!action.payload) return;
  const { type, listingId } = action.payload;
  let response: Asset;
  try {
    if (type === ListingType.LEASE_LISTING) {
      response = yield call(AssetRepository.getLeaseListing, listingId);
      if (response.leaseTerm) {
        const { expectedPrice, securityDeposit, annualRentIncrementPercentage } = response.leaseTerm;
        yield put(
          OfferActions.setCompareDetail({
            rent: expectedPrice,
            deposit: securityDeposit,
            incrementPercentage: annualRentIncrementPercentage ?? 0,
          })
        );
      }
    } else {
      response = yield call(AssetRepository.getSaleListing, listingId);
      if (response.saleTerm) {
        const { expectedPrice, expectedBookingAmount } = response.saleTerm;
        yield put(
          OfferActions.setCompareDetail({
            price: Number(expectedPrice),
            bookingAmount: Number(expectedBookingAmount),
          })
        );
      }
    }
    yield put(OfferActions.getListingDetailSuccess(response));
  } catch (e) {
    yield put(OfferActions.getListingDetailFailure());
    AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
  }
}

export function* getNegotiations(action: IFluxStandardAction<INegotiation>) {
  if (!action.payload) return;
  try {
    const response = yield call(OffersRepository.getNegotiations, action.payload);
    yield put(OfferActions.getNegotiationsSuccess(response));
  } catch (e) {
    yield put(OfferActions.getNegotiationsFailure());
    AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
  }
}

export function* watchOffer() {
  yield takeLatest(OfferActionTypes.GET.LISTING_DETAIL, getListingDetail);
  yield takeLatest(OfferActionTypes.GET.NEGOTIATIONS, getNegotiations);
}
