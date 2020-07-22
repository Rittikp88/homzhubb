import { put, takeEvery } from 'redux-saga/effects';
import { login, logout, watchUser } from '@homzhub/common/src/modules/user/saga';
import { UserActionTypes } from '@homzhub/common/src/modules/user/actions';
import { userData } from '@homzhub/common/src/mocks/UserRepositoryMocks';

jest.mock('@homzhub/common/src/services/storage/StorageService', () => 'StorageService');
jest.mock('@react-native-community/google-signin', () => {});

describe('User Saga', () => {
  it.skip('should dispatch action login success and login failure with result from API', () => {
    const mockResponse = userData;
    const mockError = 'Error';
    const generator = login({ type: UserActionTypes.AUTH.LOGIN_SUCCESS });
    generator.next();
    expect(generator.next(mockResponse).value).toEqual(
      put({ type: UserActionTypes.AUTH.LOGIN_SUCCESS, payload: userData })
    );
    expect(generator.throw(new Error(mockError)).value).toEqual(
      put({ type: UserActionTypes.AUTH.LOGIN_FAILURE, error: 'Error' })
    );
  });

  it('should dispatch action logout success and logout failure with result from API', () => {
    const mockResponse = { refresh_token: 'refreshToken' };
    const mockError = 'Error';
    const generator = logout({
      type: UserActionTypes.AUTH.LOGOUT_SUCCESS,
    });
    generator.next();
    expect(generator.next(mockResponse).value).toEqual(put({ type: UserActionTypes.AUTH.LOGOUT_SUCCESS }));
    expect(generator.throw(new Error(mockError)).value).toEqual(
      put({ type: UserActionTypes.AUTH.LOGOUT_FAILURE, error: 'Error' })
    );
  });

  it('should be done on next iteration', () => {
    const generator = watchUser();
    expect(generator.next().value).toEqual(takeEvery(UserActionTypes.AUTH.LOGIN, login));
    expect(generator.next().value).toEqual(takeEvery(UserActionTypes.AUTH.LOGOUT, logout));
  });
});
