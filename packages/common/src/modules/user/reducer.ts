import { IUserState } from '@homzhub/common/src/modules/user/interface';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { UserActionTypes, UserPayloadTypes } from '@homzhub/common/src/modules/user/actions';
import { IUser } from '@homzhub/common/src/domain/models/User';
import { ISocialMediaProvider } from '@homzhub/common/src/domain/models/SocialMediaProvider';

export const initialUserState: IUserState = {
  socialProviders: [],
  user: null,
  error: {
    user: '',
  },
  loaders: {
    user: false,
  },
};

export const userReducer = (
  state: IUserState = initialUserState,
  action: IFluxStandardAction<UserPayloadTypes>
): IUserState => {
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
        ['socialProviders']: action.payload as ISocialMediaProvider[],
        ['loaders']: { ...state.loaders, ['user']: false },
      };
    case UserActionTypes.GET.SOCIAL_MEDIA_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['user']: false },
        ['error']: { ...state.error, ['user']: action.error as string },
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
        ['user']: action.payload as IUser,
        ['loaders']: { ...state.loaders, ['user']: false },
      };
    case UserActionTypes.AUTH.LOGIN_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['user']: false },
        ['error']: { ...state.error, ['user']: action.error as string },
      };
    case UserActionTypes.AUTH.LOGOUT:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['user']: true },
        ['error']: { ...state.error, ['user']: '' },
      };
    case UserActionTypes.AUTH.LOGOUT_SUCCESS:
      return {
        ...state,
        ['user']: null, // TODO: Check the flow once the api is integrated
        ['loaders']: { ...state.loaders, ['user']: false },
      };
    case UserActionTypes.AUTH.LOGOUT_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['user']: false },
        ['error']: { ...state.error, ['user']: action.error as string },
      };
    default:
      return state;
  }
};