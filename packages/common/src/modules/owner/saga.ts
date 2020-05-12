/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { call, put, takeEvery } from '@redux-saga/core/effects';
import { OwnerRepository } from '../../domain/repositories/OwnerRepository';
import { OwnerActions, OwnerActionTypes } from './actions';

// TODO: For reference (remove)

function* getOwnerDetails() {
  try {
    const data: any = yield call(OwnerRepository.getDetails);
    yield put(OwnerActions.getOwnerDetailSuccess(data));
  } catch (e) {
    yield put(OwnerActions.getOwnerDetailFailure(e.message));
  }
}

function* watchCart() {
  yield takeEvery(OwnerActionTypes.GET.FETCH_GET_DETAIL, getOwnerDetails);
}

export const OwnerSaga = {
  watchCart,
};
