import { IAsset } from '@homzhub/common/src/domain/models/Asset';
import { IUserProfile } from '@homzhub/common/src/domain/models/UserProfile';
import { IUserPreferences } from '@homzhub/common/src/domain/models/UserPreferences';
import { IUserTokens } from '@homzhub/common/src/services/storage/StorageService';

export interface IUserState {
  tokens: IUserTokens | null;
  userProfile: IUserProfile | null;
  userPreferences: IUserPreferences | null;
  assets: IAsset[];
  activeAssets: IAsset[];
  isOnBoardingCompleted: boolean;
  isChangeStack: boolean;
  isAddPropertyFlow: boolean;
  userCountryCode: number;
  favouriteProperties: IAsset[];
  error: {
    user: string;
  };
  loaders: {
    user: boolean;
    userProfile: boolean;
    userPreferences: boolean;
    activeAssets: boolean;
  };
}

export interface IAuthCallback {
  callback?: (status: boolean) => void;
}
