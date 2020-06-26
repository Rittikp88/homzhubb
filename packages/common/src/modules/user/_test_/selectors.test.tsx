import { IState } from '@homzhub/common/src/modules/interfaces';
import { initialUserState } from '@homzhub/common/src/modules/user/reducer';
import { initialPropertyState } from '@homzhub/common/src/modules/property/reducer';
import { userData } from '@homzhub/common/src/mocks/UserRepositoryMocks';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';

const state: IState = {
  user: {
    ...initialUserState,
    user: userData,
    isOnBoardingCompleted: false,
  },
  property: {
    ...initialPropertyState,
  },
};

describe('User Selector', () => {
  it('should verify isLogged in', () => {
    expect(UserSelector.isLoggedIn(state)).toBe(true);
  });

  it('should verify onBoarding completed', () => {
    expect(UserSelector.hasOnBoardingCompleted(state)).toBe(false);
  });

  it('should return user Detail', () => {
    expect(UserSelector.getUserDetails(state)).toBe(userData);
  });
});
