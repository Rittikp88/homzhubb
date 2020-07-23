import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { initialUserState } from '@homzhub/common/src/modules/user/reducer';
import { initialPropertyState } from '@homzhub/common/src/modules/property/reducer';
import { userData } from '@homzhub/common/src/mocks/UserRepositoryMocks';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { User } from '@homzhub/common/src/domain/models/User';

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
    const user = ObjectMapper.deserialize(User, userData);
    expect(UserSelector.getUserDetails(state)).toEqual(user);
  });
});
