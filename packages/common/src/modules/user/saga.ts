/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { call, put, takeEvery } from '@redux-saga/core/effects';
import { StorageKeys, StorageService } from '@homzhub/common/src/services/storage/StorageService';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';
import {
  IEmailLoginPayload,
  IOtpLoginPayload,
  IUserLogoutPayload,
} from '@homzhub/common/src/domain/repositories/interfaces';
import { UserActions, UserActionTypes } from '@homzhub/common/src/modules/user/actions';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { IUser } from '@homzhub/common/src/domain/models/User';

export function* login(action: IFluxStandardAction<IEmailLoginPayload | IOtpLoginPayload>) {
  const { payload } = action;
  try {
    const data: IUser = yield call(UserRepository.login, payload as IEmailLoginPayload | IOtpLoginPayload);

    yield put(UserActions.loginSuccess(data));
    yield StorageService.set<IUser>('@user', data);
  } catch (e) {
    yield put(UserActions.loginFailure(e.message));
  }
}

export function* logout(action: IFluxStandardAction<IUserLogoutPayload>) {
  const { payload } = action;
  try {
    yield call(UserRepository.logout, payload);
    yield put(UserActions.logoutSuccess());
    yield StorageService.remove(StorageKeys.USER);
  } catch (e) {
    yield put(UserActions.logoutFailure(e.message));
  }
}

export function* watchUser() {
  yield takeEvery(UserActionTypes.AUTH.LOGIN, login);
  yield takeEvery(UserActionTypes.AUTH.LOGOUT, logout);
}
