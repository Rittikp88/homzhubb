import { IState } from '@homzhub/common/src/modules/interfaces';

const isLoggedIn = (state: IState): boolean => {
  return !!state.user.user;
};

export const UserSelector = {
  isLoggedIn,
};
