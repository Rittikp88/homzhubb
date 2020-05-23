/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { call, put, takeEvery } from '@redux-saga/core/effects';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';
import { UserActions, UserActionTypes } from '@homzhub/common/src/modules/user/actions';

function* getSocialMedia() {
  try {
    const data: any = yield call(UserRepository.getSocialMedia);
    yield put(UserActions.getSocialMediaSuccess(data));
  } catch (e) {
    yield put(UserActions.getSocialMediaFailure(e.message));
  }
}

export function* watchUser() {
  yield takeEvery(UserActionTypes.GET.SOCIAL_MEDIA, getSocialMedia);
}
