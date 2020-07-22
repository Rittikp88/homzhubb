/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { call, put, takeEvery } from '@redux-saga/core/effects';
import { StorageKeys, StorageService } from '@homzhub/common/src/services/storage/StorageService';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';
import { UserActions, UserActionTypes } from '@homzhub/common/src/modules/user/actions';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import {
  IEmailLoginPayload,
  IOtpLoginPayload,
  IRefreshTokenPayload,
} from '@homzhub/common/src/domain/repositories/interfaces';
import { User, IUser } from '@homzhub/common/src/domain/models/User';

export function* login(action: IFluxStandardAction<IEmailLoginPayload | IOtpLoginPayload>) {
  const { payload } = action;
  try {
    const data: User = yield call(UserRepository.login, payload as IEmailLoginPayload | IOtpLoginPayload);

    const serializedUser = ObjectMapper.serialize<User, IUser>(data);

    yield put(UserActions.loginSuccess(serializedUser));
    yield StorageService.set<IUser>('@user', serializedUser);
  } catch (e) {
    yield put(UserActions.loginFailure(e.message));
  }
}

export function* logout(action: IFluxStandardAction<IRefreshTokenPayload>) {
  const { payload } = action;
  try {
    yield call(UserRepository.logout, payload as IRefreshTokenPayload);
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
