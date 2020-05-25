/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { call, put, takeEvery } from '@redux-saga/core/effects';
import { StorageService } from '@homzhub/common/src/services/storage/StorageService';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';
import { IEmailLoginPayload, IOtpLoginPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { UserActions, UserActionTypes } from '@homzhub/common/src/modules/user/actions';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { IUser } from '@homzhub/common/src/domain/models/User';

function* getSocialMedia() {
  try {
    const data = yield call(UserRepository.getSocialMedia);
    yield put(UserActions.getSocialMediaSuccess(data));
  } catch (e) {
    yield put(UserActions.getSocialMediaFailure(e.message));
  }
}

function* login(action: IFluxStandardAction<IEmailLoginPayload | IOtpLoginPayload>) {
  const { payload } = action;
  try {
    // @ts-ignore
    const data: IUser = yield call(UserRepository.login, payload);

    yield put(UserActions.loginSuccess(data));
    yield StorageService.set<IUser>('@user', data);
  } catch (e) {
    yield put(UserActions.loginFailure(e.message));
  }
}

export function* watchUser() {
  yield takeEvery(UserActionTypes.GET.SOCIAL_MEDIA, getSocialMedia);
  yield takeEvery(UserActionTypes.AUTH.LOGIN, login);
}
