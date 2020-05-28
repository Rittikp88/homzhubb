import { IState } from '@homzhub/common/src/modules/interfaces';
import { ISocialMediaProvider } from '@homzhub/common/src/domain/models/SocialMediaProvider';
import { IUser } from '@homzhub/common/src/domain/models/User';

const isLoggedIn = (state: IState): boolean => {
  return !!state.user.user;
};

const getSocialMediaProviders = (state: IState): ISocialMediaProvider[] => {
  const { user } = state;
  return user.socialProviders;
};

const getUserDetails = (state: IState): IUser | null => {
  const {
    user: { user },
  } = state;
  return user;
};

export const UserSelector = {
  isLoggedIn,
  getSocialMediaProviders,
  getUserDetails,
};
