import { IUser } from '@homzhub/common/src/domain/models/User';

export interface IUserState {
  data: any;
  user: IUser | null;
  error: {
    user: string;
  };
  loaders: {
    user: boolean;
  };
}
