import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { SocialMediaProvider } from '@homzhub/common/src/domain/models/SocialMediaProvider';

const isLoggedIn = (state: IState): boolean => {
  return !!state.user.user;
};

const getSocialMediaProviders = (state: IState): SocialMediaProvider[] => {
  const { user } = state;
  return ObjectMapper.deserializeArray(SocialMediaProvider, user.socialProviders);
};

export const UserSelector = {
  isLoggedIn,
  getSocialMediaProviders,
};
