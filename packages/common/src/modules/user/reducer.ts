import { IUserState } from '@homzhub/common/src/modules/user/interface';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { UserActionTypes, UserPayloadTypes } from '@homzhub/common/src/modules/user/actions';
import { IUser } from '@homzhub/common/src/domain/models/User';

export const initialUserState: IUserState = {
  socialProviders: null,
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
        ['socialProviders']: action.payload,
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
    default:
      return state;
  }
};
