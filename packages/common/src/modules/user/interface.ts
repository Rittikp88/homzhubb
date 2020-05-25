import { IUser } from '@homzhub/common/src/domain/models/User';

export interface IUserState {
  socialProviders: any;
  user: IUser | null;
  error: {
    user: string;
  };
  loaders: {
    user: boolean;
  };
}
