import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { UserProfile } from '@homzhub/common/src/domain/models/UserProfile';
import { UserPreferences } from '@homzhub/common/src/domain/models/UserPreferences';
import { IState } from '@homzhub/common/src/modules/interfaces';

const isLoggedIn = (state: IState): boolean => {
  return !!state.user.tokens;
};

const hasOnBoardingCompleted = (state: IState): boolean => {
  return state.user.isOnBoardingCompleted;
};

const getLoadingState = (state: IState): boolean => {
  const {
    user: {
      loaders: { user },
    },
  } = state;
  return user;
};

const getIsChangeStack = (state: IState): boolean => {
  const {
    user: { isChangeStack },
  } = state;
  return isChangeStack;
};

const getUserProfile = (state: IState): UserProfile => {
  const {
    user: { userProfile },
  } = state;

  return ObjectMapper.deserialize(UserProfile, userProfile);
};

const isUserProfileLoading = (state: IState): boolean => {
  const {
    user: {
      loaders: { userProfile },
    },
  } = state;
  return userProfile;
};

const isAddPropertyFlow = (state: IState): boolean => {
  return state.user.isAddPropertyFlow;
};

const getUserPreferences = (state: IState): UserPreferences => {
  const {
    user: { userPreferences },
  } = state;

  return ObjectMapper.deserialize(UserPreferences, userPreferences);
};

const getUserFinancialYear = (state: IState): { startDate: string; endDate: string } => {
  const userPreferences = getUserPreferences(state);

  if (!userPreferences) {
    return { startDate: '', endDate: '' };
  }

  const [startMonth, endMonth] = userPreferences.financialYearCode.split('-');
  const currentMonth = DateUtils.getCurrentMonthIndex();

  if (currentMonth >= parseInt(startMonth, 10)) {
    return {
      startDate: `${DateUtils.getCurrentYear()}-${startMonth}-01`,
      endDate: `${DateUtils.getNextYear()}-${endMonth}-${DateUtils.getDaysInMonth(parseInt(endMonth, 10))}`,
    };
  }

  return {
    startDate: `${DateUtils.getLastYear()}-${startMonth}-01`,
    endDate: `${DateUtils.getCurrentYear()}-${endMonth}-${DateUtils.getDaysInMonth(parseInt(endMonth, 10))}`,
  };
};

const isUserPreferencesLoading = (state: IState): boolean => {
  const {
    user: {
      loaders: { userPreferences },
    },
  } = state;
  return userPreferences;
};

export const UserSelector = {
  isLoggedIn,
  hasOnBoardingCompleted,
  getLoadingState,
  getIsChangeStack,
  getUserProfile,
  isUserProfileLoading,
  isAddPropertyFlow,
  getUserPreferences,
  getUserFinancialYear,
  isUserPreferencesLoading,
};
