import { IUser } from '@homzhub/common/src/domain/models/User';
import { ISocialMediaProvider } from '@homzhub/common/src/domain/models/SocialMediaProvider';

export interface IUserState {
  socialProviders: ISocialMediaProvider[];
  user: IUser | null;
  error: {
    user: string;
  };
  loaders: {
    user: boolean;
  };
}