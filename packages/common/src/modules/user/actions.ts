import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { IEmailLoginPayload, IOtpLoginPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { IUser } from '@homzhub/common/src/domain/models/User';
import { ISocialMediaProvider } from '@homzhub/common/src/domain/models/SocialMediaProvider';

const actionTypePrefix = 'User/';

export const UserActionTypes = {
  GET: {
    SOCIAL_MEDIA: `${actionTypePrefix}SOCIAL_MEDIA`,
    SOCIAL_MEDIA_SUCCESS: `${actionTypePrefix}SOCIAL_MEDIA_SUCCESS`,
    SOCIAL_MEDIA_FAILURE: `${actionTypePrefix}SOCIAL_MEDIA_FAILURE`,
  },
  AUTH: {
    LOGIN: `${actionTypePrefix}LOGIN`,
    LOGIN_SUCCESS: `${actionTypePrefix}LOGIN_SUCCESS`,
    LOGIN_FAILURE: `${actionTypePrefix}LOGIN_FAILURE`,
    LOGOUT: `${actionTypePrefix}LOGOUT`,
    LOGOUT_SUCCESS: `${actionTypePrefix}LOGOUT_SUCCESS`,
    LOGOUT_FAILURE: `${actionTypePrefix}LOGOUT_FAILURE`,
  },
};

const getSocialMedia = (): IFluxStandardAction => {
  return {
    type: UserActionTypes.GET.SOCIAL_MEDIA,
  };
};

const getSocialMediaSuccess = (data: any): IFluxStandardAction<ISocialMediaProvider[]> => {
  return {
    type: UserActionTypes.GET.SOCIAL_MEDIA_SUCCESS,
    payload: data,
  };
};

const getSocialMediaFailure = (error: string): IFluxStandardAction => {
  return {
    type: UserActionTypes.GET.SOCIAL_MEDIA_FAILURE,
    error,
  };
};

const login = (
  payload: IEmailLoginPayload | IOtpLoginPayload
): IFluxStandardAction<IEmailLoginPayload | IOtpLoginPayload> => {
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

const logout = (): IFluxStandardAction => {
  return {
    type: UserActionTypes.AUTH.LOGOUT,
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

export type UserPayloadTypes = string | IUser | ISocialMediaProvider[];
export const UserActions = {
  getSocialMedia,
  getSocialMediaSuccess,
  getSocialMediaFailure,
  login,
  loginSuccess,
  loginFailure,
  logout,
  logoutSuccess,
  logoutFailure,
};
