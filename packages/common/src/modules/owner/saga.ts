/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { call, put, takeEvery } from '@redux-saga/core/effects';
import { OwnerRepository } from '@homzhub/common/src/domain/repositories/owner/OwnerRepository';
import { OwnerActions, OwnerActionTypes } from '@homzhub/common/src/modules/owner/actions';

// TODO: For reference (remove)

function* getOwnerDetails() {
  try {
    const data: any = yield call(OwnerRepository.getDetails);
    yield put(OwnerActions.getOwnerDetailSuccess(data));
  } catch (e) {
    yield put(OwnerActions.getOwnerDetailFailure(e.message));
  }
}

export function* watchOwner() {
  yield takeEvery(OwnerActionTypes.GET.FETCH_GET_DETAIL, getOwnerDetails);
}
