import { IState } from '@homzhub/common/src/modules/interfaces';
import { User } from '@homzhub/common/src/domain/models/User';
import { ObjectMapper } from '../../utils/ObjectMapper';

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

export const UserSelector = {
  isLoggedIn,
  hasOnBoardingCompleted,
  getUserDetails,
};
