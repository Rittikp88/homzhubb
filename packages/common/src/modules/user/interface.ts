import { IUserTokens } from '@homzhub/common/src/services/storage/StorageService';
import { IAsset } from '@homzhub/common/src/domain/models/Asset';
import { IUserProfile } from '@homzhub/common/src/domain/models/UserProfile';
import { IUserPreferences } from '@homzhub/common/src/domain/models/UserPreferences';
import { IUserSubscription } from '@homzhub/common/src/domain/models/UserSubscription';

export interface IUserState {
  tokens: IUserTokens | null;
  userProfile: IUserProfile | null;
  userPreferences: IUserPreferences | null;
  assets: IAsset[];
  isOnBoardingCompleted: boolean;
  isChangeStack: boolean;
  isAddPropertyFlow: boolean;
  userCountryCode: number;
  favouriteProperties: IAsset[];
  userSubscriptions: IUserSubscription | null;
  userServices: IAsset[];
  error: {
    user: string;
  };
  loaders: {
    user: boolean;
    userProfile: boolean;
    userPreferences: boolean;
    userSubscriptions: boolean;
    whileAssets: boolean;
    whileFavouriteProperties: boolean;
    userService: boolean;
  };
}

export interface IAuthCallback {
  callback?: (status: boolean) => void;
}
