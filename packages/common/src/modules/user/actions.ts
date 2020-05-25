/* eslint-disable @typescript-eslint/no-explicit-any */

import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { IEmailLoginPayload, IMobileLoginPayload } from '@homzhub/common/src/domain/repositories/interfaces';

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
  },
};

const getSocialMedia = (): IFluxStandardAction => {
  return {
    type: UserActionTypes.GET.SOCIAL_MEDIA,
  };
};

const getSocialMediaSuccess = (data: any): IFluxStandardAction<any> => {
  return {
    type: UserActionTypes.GET.SOCIAL_MEDIA_SUCCESS,
    payload: data,
  };
};

const getSocialMediaFailure = (error: string): IFluxStandardAction<string> => {
  return {
    type: UserActionTypes.GET.SOCIAL_MEDIA_FAILURE,
    payload: error,
  };
};

const login = (
  payload: IEmailLoginPayload | IMobileLoginPayload
): IFluxStandardAction<IEmailLoginPayload | IMobileLoginPayload> => {
  return {
    type: UserActionTypes.AUTH.LOGIN,
    payload,
  };
};

const loginSuccess = (data: any): IFluxStandardAction<any> => {
  return {
    type: UserActionTypes.AUTH.LOGIN_SUCCESS,
    payload: data,
  };
};

const loginFailure = (error: string): IFluxStandardAction<string> => {
  return {
    type: UserActionTypes.AUTH.LOGIN_FAILURE,
    payload: error,
  };
};

export const UserActions = {
  getSocialMedia,
  getSocialMediaSuccess,
  getSocialMediaFailure,
  login,
  loginSuccess,
  loginFailure,
};
