// @ts-nocheck
import { UserActions, UserActionTypes } from '@homzhub/common/src/modules/user/actions';
import { loginPayload, userData } from '@homzhub/common/src/mocks/UserRepositoryMocks';

describe('User Actions', () => {
  it('should call login action', () => {
    const action = UserActions.login(loginPayload);
    expect(action).toStrictEqual({
      type: UserActionTypes.AUTH.LOGIN,
      payload: loginPayload,
    });
  });

  it('should call login success action', () => {
    const action = UserActions.loginSuccess(userData);
    expect(action).toStrictEqual({
      type: UserActionTypes.AUTH.LOGIN_SUCCESS,
      payload: userData,
    });
  });

  it('should call login failure action', () => {
    const action = UserActions.loginFailure('Test Error');
    expect(action).toStrictEqual({
      type: UserActionTypes.AUTH.LOGIN_FAILURE,
      error: 'Test Error',
    });
  });

  it('should call logout action', () => {
    const action = UserActions.logout({ refresh_token: 'refreshToken' });
    expect(action).toStrictEqual({
      type: UserActionTypes.AUTH.LOGOUT,
      payload: { refresh_token: 'refreshToken' },
    });
  });

  it('should call logout success action', () => {
    const action = UserActions.logoutSuccess();
    expect(action).toStrictEqual({
      type: UserActionTypes.AUTH.LOGOUT_SUCCESS,
    });
  });

  it('should call logout failure action', () => {
    const action = UserActions.logoutFailure('Test Error');
    expect(action).toStrictEqual({
      type: UserActionTypes.AUTH.LOGOUT_FAILURE,
      error: 'Test Error',
    });
  });

  it('should call update onBoarding action', () => {
    const action = UserActions.updateOnBoarding(true);
    expect(action).toStrictEqual({
      type: UserActionTypes.UPDATE_ONBOARDING,
      payload: true,
    });
  });
});
