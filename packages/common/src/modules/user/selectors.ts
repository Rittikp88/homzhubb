import { IState } from '@homzhub/common/src/modules/interfaces';
import { IUser } from '@homzhub/common/src/domain/models/User';

const isLoggedIn = (state: IState): boolean => {
  return !!state.user.user;
};

const hasOnBoardingCompleted = (state: IState): boolean => {
  return state.user.isOnBoardingCompleted;
};

const getUserDetails = (state: IState): IUser | null => {
  const {
    user: { user },
  } = state;
  return user;
};

export const UserSelector = {
  isLoggedIn,
  hasOnBoardingCompleted,
  getUserDetails,
};
