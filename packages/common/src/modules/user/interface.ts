import { IUser } from '@homzhub/common/src/domain/models/User';

export interface IUserState {
  user: IUser | null;
  isOnBoardingCompleted: boolean;
  isChangeStack: boolean;
  error: {
    user: string;
  };
  loaders: {
    user: boolean;
  };
}
