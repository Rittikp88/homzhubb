import { IUserState } from '@homzhub/common/src/modules/user/interface';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { UserActionTypes, UserPayloadTypes } from '@homzhub/common/src/modules/user/actions';
import { IUser } from '@homzhub/common/src/domain/models/User';

export const initialUserState: IUserState = {
  user: null,
  isOnBoardingCompleted: false,
  isChangeStack: true,
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
    case UserActionTypes.AUTH.LOGOUT:
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
    case UserActionTypes.AUTH.LOGOUT_SUCCESS:
      return {
        ...state,
        ['user']: null,
        ['loaders']: { ...state.loaders, ['user']: false },
      };
    case UserActionTypes.AUTH.LOGOUT_FAILURE:
    case UserActionTypes.AUTH.LOGIN_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['user']: false },
        ['error']: { ...state.error, ['user']: action.error as string },
      };
    case UserActionTypes.UPDATE_ONBOARDING:
      return {
        ...state,
        ['isOnBoardingCompleted']: action.payload as boolean,
      };
    case UserActionTypes.SET.CHANGE_STACK:
      return { ...state, ['isChangeStack']: action.payload as boolean };
    default:
      return state;
  }
};
