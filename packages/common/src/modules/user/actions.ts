/* eslint-disable @typescript-eslint/no-explicit-any */

import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';

const actionTypePrefix = 'User/';

export const UserActionTypes = {
  GET: {
    SOCIAL_MEDIA: `${actionTypePrefix}SOCIAL_MEDIA`,
    SOCIAL_MEDIA_SUCCESS: `${actionTypePrefix}SOCIAL_MEDIA_SUCCESS`,
    SOCIAL_MEDIA_FAILURE: `${actionTypePrefix}SOCIAL_MEDIA_FAILURE`,
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

export const UserActions = {
  getSocialMedia,
  getSocialMediaSuccess,
  getSocialMediaFailure,
};
