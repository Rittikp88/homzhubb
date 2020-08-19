import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { IRefreshTokenPayload, ILoginPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { IUser } from '@homzhub/common/src/domain/models/User';

const actionTypePrefix = 'User/';

export const UserActionTypes = {
  AUTH: {
    LOGIN: `${actionTypePrefix}LOGIN`,
    LOGIN_SUCCESS: `${actionTypePrefix}LOGIN_SUCCESS`,
    LOGIN_FAILURE: `${actionTypePrefix}LOGIN_FAILURE`,
    LOGOUT: `${actionTypePrefix}LOGOUT`,
    LOGOUT_SUCCESS: `${actionTypePrefix}LOGOUT_SUCCESS`,
    LOGOUT_FAILURE: `${actionTypePrefix}LOGOUT_FAILURE`,
  },
  SET: {
    CHANGE_STACK: `${actionTypePrefix}CHANGE_STACK`,
  },
  UPDATE_ONBOARDING: `${actionTypePrefix}UPDATE_ONBOARDING`,
};

const login = (payload: ILoginPayload): IFluxStandardAction<ILoginPayload> => {
  return {
    type: UserActionTypes.AUTH.LOGIN,
    payload,
  };
};

const loginSuccess = (data: IUser): IFluxStandardAction<IUser> => {
  return {
    type: UserActionTypes.AUTH.LOGIN_SUCCESS,
    payload: data,
  };
};

const loginFailure = (error: string): IFluxStandardAction => {
  return {
    type: UserActionTypes.AUTH.LOGIN_FAILURE,
    error,
  };
};

const logout = (data: IRefreshTokenPayload): IFluxStandardAction<IRefreshTokenPayload> => {
  return {
    type: UserActionTypes.AUTH.LOGOUT,
    payload: data,
  };
};

const logoutSuccess = (): IFluxStandardAction => {
  return {
    type: UserActionTypes.AUTH.LOGOUT_SUCCESS,
  };
};

const logoutFailure = (error: string): IFluxStandardAction => {
  return {
    type: UserActionTypes.AUTH.LOGOUT_FAILURE,
    error,
  };
};

const updateOnBoarding = (updatedOnBoarding: boolean): IFluxStandardAction<boolean> => ({
  type: UserActionTypes.UPDATE_ONBOARDING,
  payload: updatedOnBoarding,
});

const setChangeStack = (payload: boolean): IFluxStandardAction<boolean> => ({
  type: UserActionTypes.SET.CHANGE_STACK,
  payload,
});

export type UserPayloadTypes = string | boolean | IUser;
export const UserActions = {
  login,
  loginSuccess,
  loginFailure,
  logout,
  logoutSuccess,
  logoutFailure,
  updateOnBoarding,
  setChangeStack,
};
