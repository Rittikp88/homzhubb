import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { User } from '@homzhub/common/src/domain/models/User';
import { IState } from '@homzhub/common/src/modules/interfaces';

const isLoggedIn = (state: IState): boolean => {
  return !!state.user.user;
};

const hasOnBoardingCompleted = (state: IState): boolean => {
  return state.user.isOnBoardingCompleted;
};

const getUserDetails = (state: IState): User | null => {
  const {
    user: { user },
  } = state;

  if (!user) {
    return null;
  }

  return ObjectMapper.deserialize(User, user);
};

const getLoadingState = (state: IState): boolean => {
  const {
    user: {
      loaders: { user },
    },
  } = state;
  return user;
};

export const UserSelector = {
  isLoggedIn,
  hasOnBoardingCompleted,
  getUserDetails,
  getLoadingState,
};
