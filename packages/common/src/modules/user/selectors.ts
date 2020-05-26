import { IState } from '@homzhub/common/src/modules/interfaces';
import { ISocialMediaProvider } from '@homzhub/common/src/domain/models/SocialMediaProvider';

const isLoggedIn = (state: IState): boolean => {
  return !!state.user.user;
};

const getSocialMediaProviders = (state: IState): ISocialMediaProvider[] => {
  const { user } = state;
  return user.socialProviders;
};

export const UserSelector = {
  isLoggedIn,
  getSocialMediaProviders,
};
