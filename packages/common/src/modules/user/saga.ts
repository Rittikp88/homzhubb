/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { call, put, takeEvery } from '@redux-saga/core/effects';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';
import { UserActions, UserActionTypes } from '@homzhub/common/src/modules/user/actions';
import { IEmailLoginPayload, IMobileLoginPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { IUser, StorageService } from '@homzhub/common/src/services/storage/StorageService';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';

function* getSocialMedia() {
  try {
    const data: any = yield call(UserRepository.getSocialMedia);
    yield put(UserActions.getSocialMediaSuccess(data));
  } catch (e) {
    yield put(UserActions.getSocialMediaFailure(e.message));
  }
}

function* login(action: IFluxStandardAction<IEmailLoginPayload | IMobileLoginPayload>) {
  const { payload } = action;
  try {
    const data: any = yield call(UserRepository.login, payload);
    StorageService.set<IUser>('@user', {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      email: '',
      userName: '',
    }).then();
    yield put(UserActions.loginSuccess(data));
  } catch (e) {
    yield put(UserActions.loginFailure(e.message));
  }
}

export function* watchUser() {
  yield takeEvery(UserActionTypes.GET.SOCIAL_MEDIA, getSocialMedia);
  yield takeEvery(UserActionTypes.AUTH.LOGIN, login);
}
