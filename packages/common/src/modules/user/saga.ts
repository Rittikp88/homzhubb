/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { call, put, takeEvery } from '@redux-saga/core/effects';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { StorageKeys, StorageService } from '@homzhub/common/src/services/storage/StorageService';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';
import { UserActions, UserActionTypes } from '@homzhub/common/src/modules/user/actions';
import { AssetActions } from '@homzhub/common/src/modules/asset/actions';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { ILoginPayload, IRefreshTokenPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { User, IUser } from '@homzhub/common/src/domain/models/User';

export function* login(action: IFluxStandardAction<ILoginPayload>) {
  if (!action.payload) return;
  const {
    payload: { data, callback },
  } = action;
  try {
    const userData: User = yield call(UserRepository.login, data);

    const serializedUser = ObjectMapper.serialize<User, IUser>(userData);

    yield put(UserActions.loginSuccess(serializedUser));
    yield StorageService.set<IUser>('@user', serializedUser);
    yield put(AssetActions.getAssetCount());
    yield put(UserActions.getUserProfile());
    if (callback) {
      callback();
    }
  } catch (e) {
    const error = ErrorUtils.getErrorMessage(e.details);
    AlertHelper.error({ message: error });
    yield put(UserActions.loginFailure(error));
  }
}

export function* logout(action: IFluxStandardAction<IRefreshTokenPayload>) {
  const { payload } = action;
  try {
    yield call(UserRepository.logout, payload as IRefreshTokenPayload);
    yield put(UserActions.logoutSuccess());
    yield StorageService.remove(StorageKeys.USER);
  } catch (e) {
    const error = ErrorUtils.getErrorMessage(e.details);
    AlertHelper.error({ message: error });
    yield put(UserActions.logoutFailure(error));
  }
}

export function* userProfile() {
  try {
    const response = yield call(UserRepository.getUserProfile);
    yield put(UserActions.getUserProfileSuccess(response));
  } catch (e) {
    const error = ErrorUtils.getErrorMessage(e.details);
    AlertHelper.error({ message: error });
    yield put(UserActions.getUserProfileFailure());
  }
}

export function* watchUser() {
  yield takeEvery(UserActionTypes.AUTH.LOGIN, login);
  yield takeEvery(UserActionTypes.AUTH.LOGOUT, logout);
  yield takeEvery(UserActionTypes.GET.USER_PROFILE, userProfile);
}
