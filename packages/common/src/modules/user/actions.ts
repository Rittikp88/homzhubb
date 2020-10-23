import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { IRefreshTokenPayload, ILoginPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { IUser } from '@homzhub/common/src/domain/models/User';
import { IUserProfile, UserProfile } from '@homzhub/common/src/domain/models/UserProfile';

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
  GET: {
    USER_PROFILE: `${actionTypePrefix}USER_PROFILE`,
    USER_PROFILE_SUCCESS: `${actionTypePrefix}USER_PROFILE_SUCCESS`,
    USER_PROFILE_FAILURE: `${actionTypePrefix}USER_PROFILE_FAILURE`,
  },
  SET: {
    CHANGE_STACK: `${actionTypePrefix}CHANGE_STACK`,
    IS_ADD_PROPERTY_FLOW: `${actionTypePrefix}IS_ADD_PROPERTY_FLOW`,
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

const getUserProfile = (): IFluxStandardAction => ({
  type: UserActionTypes.GET.USER_PROFILE,
});

const getUserProfileSuccess = (payload: UserProfile): IFluxStandardAction<IUserProfile> => ({
  type: UserActionTypes.GET.USER_PROFILE_SUCCESS,
  payload: ObjectMapper.serialize(payload),
});

const getUserProfileFailure = (): IFluxStandardAction => ({
  type: UserActionTypes.GET.USER_PROFILE_FAILURE,
});

const setAddPropertyFlow = (payload: boolean): IFluxStandardAction<boolean> => ({
  type: UserActionTypes.SET.IS_ADD_PROPERTY_FLOW,
  payload,
});

export type UserPayloadTypes = string | boolean | IUser | IUserProfile;
export const UserActions = {
  login,
  loginSuccess,
  loginFailure,
  logout,
  logoutSuccess,
  logoutFailure,
  updateOnBoarding,
  setChangeStack,
  getUserProfile,
  getUserProfileSuccess,
  getUserProfileFailure,
  setAddPropertyFlow,
};
