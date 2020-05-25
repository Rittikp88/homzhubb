export interface IUserState {
  data: any;
  user: any;
  error: {
    user: string;
  };
  loaders: {
    user: boolean;
  };
}
