import { IUser } from '@homzhub/common/src/domain/models/User';
import { IUserProfile } from '@homzhub/common/src/domain/models/UserProfile';

export interface IUserState {
  user: IUser | null;
  userProfile: IUserProfile | null;
  isOnBoardingCompleted: boolean;
  isChangeStack: boolean;
  error: {
    user: string;
  };
  loaders: {
    user: boolean;
    userProfile: boolean;
  };
}
