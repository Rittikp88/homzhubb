import { IUserState } from '@homzhub/common/src/modules/user/interface';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { UserActionTypes } from '@homzhub/common/src/modules/user/actions';
import { SocialMediaData } from '@homzhub/common/src/mocks/socialMedia';

export const initialUserState: IUserState = {
  data: SocialMediaData,
  user: null,
  error: {
    user: '',
  },
  loaders: {
    user: false,
  },
};

export const userReducer = (state: IUserState = initialUserState, action: IFluxStandardAction): IUserState => {
  switch (action.type) {
    case UserActionTypes.GET.SOCIAL_MEDIA:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['user']: true },
        ['error']: { ...state.error, ['user']: '' },
      };
    case UserActionTypes.GET.SOCIAL_MEDIA_SUCCESS:
      return {
        ...state,
        // ['data']: action.payload, // TODO: To be changed to null when the api is ready
        ['loaders']: { ...state.loaders, ['user']: false },
      };
    case UserActionTypes.GET.SOCIAL_MEDIA_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['user']: false },
        ['error']: { ...state.error, ['user']: '' },
      };
    case UserActionTypes.AUTH.LOGIN:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['user']: true },
        ['error']: { ...state.error, ['user']: '' },
      };
    case UserActionTypes.AUTH.LOGIN_SUCCESS:
      return {
        ...state,
        ['user']: action.payload,
        ['loaders']: { ...state.loaders, ['user']: false },
      };
    case UserActionTypes.AUTH.LOGIN_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['user']: false },
        ['error']: { ...state.error, ['user']: '' },
      };
    default:
      return state;
  }
};
