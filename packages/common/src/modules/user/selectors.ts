import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { User } from '@homzhub/common/src/domain/models/User';
import { UserProfile } from '@homzhub/common/src/domain/models/UserProfile';

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

const getIsChangeStack = (state: IState): boolean => {
  const {
    user: { isChangeStack },
  } = state;
  return isChangeStack;
};

const getUserProfile = (state: IState): UserProfile => {
  const {
    user: { userProfile },
  } = state;

  return ObjectMapper.deserialize(UserProfile, userProfile);
};

const isUserProfileLoading = (state: IState): boolean => {
  const {
    user: {
      loaders: { userProfile },
    },
  } = state;
  return userProfile;
};

export const UserSelector = {
  isLoggedIn,
  hasOnBoardingCompleted,
  getUserDetails,
  getLoadingState,
  getIsChangeStack,
  getUserProfile,
  isUserProfileLoading,
};
