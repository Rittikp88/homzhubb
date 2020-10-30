import { IUser } from '@homzhub/common/src/domain/models/User';
import { IUserProfile } from '@homzhub/common/src/domain/models/UserProfile';
import { IUserPreferences } from '@homzhub/common/src/domain/models/UserPreferences';

export interface IUserState {
  user: IUser | null;
  userProfile: IUserProfile | null;
  userPreferences: IUserPreferences | null;
  isOnBoardingCompleted: boolean;
  isChangeStack: boolean;
  isAddPropertyFlow: boolean;
  error: {
    user: string;
  };
  loaders: {
    user: boolean;
    userProfile: boolean;
    userPreferences: boolean;
  };
}
