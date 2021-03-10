import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { CommonSelectors } from '@homzhub/common/src/modules/common/selectors';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { UserProfile } from '@homzhub/common/src/domain/models/UserProfile';
import { MetricSystems, UserPreferences } from '@homzhub/common/src/domain/models/UserPreferences';
import { Currency } from '@homzhub/common/src/domain/models/Currency';
import { Wishlist } from '@homzhub/common/src/domain/models/Wishlist';
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

const getUserFinancialYear = (
  state: IState
): { startDate: string; endDate: string; startMonthIndex: number; endMonthIndex: number } => {
  const userPreferences = getUserPreferences(state);

  if (!userPreferences) {
    return { startDate: '', endDate: '', startMonthIndex: 0, endMonthIndex: 0 };
  }

  const [startMonth, endMonth] = userPreferences.financialYearCode.split('-');
  const startMonthIndex = parseInt(startMonth, 10) - 1;
  const endMonthIndex = parseInt(endMonth, 10) - 1;
  const currentMonth = DateUtils.getCurrentMonthIndex();

  if (parseInt(endMonth, 10) === 12 && parseInt(startMonth, 10) === 1) {
    return {
      startDate: `${DateUtils.getCurrentYear()}-${startMonth}-01`,
      endDate: `${DateUtils.getCurrentYear()}-${endMonth}-${DateUtils.getDaysInMonth(parseInt(endMonth, 10))}`,
      startMonthIndex,
      endMonthIndex,
    };
  }

  if (currentMonth >= parseInt(startMonth, 10)) {
    return {
      startDate: `${DateUtils.getCurrentYear()}-${startMonth}-01`,
      endDate: `${DateUtils.getNextYear()}-${endMonth}-${DateUtils.getDaysInMonth(parseInt(endMonth, 10))}`,
      startMonthIndex,
      endMonthIndex,
    };
  }

  return {
    startDate: `${DateUtils.getLastYear()}-${startMonth}-01`,
    endDate: `${DateUtils.getCurrentYear()}-${endMonth}-${DateUtils.getDaysInMonth(parseInt(endMonth, 10))}`,
    startMonthIndex,
    endMonthIndex,
  };
};

const getMetricSystem = (state: IState): MetricSystems => {
  const userPreferences = getUserPreferences(state);
  if (!userPreferences) {
    return MetricSystems.KILOMETERS;
  }
  return userPreferences.metricUnit;
};

const getCurrency = (state: IState): Currency => {
  const userPreferences = getUserPreferences(state);
  if (!userPreferences) {
    return CommonSelectors.getDefaultCurrency(state);
  }
  return userPreferences.currencyObj;
};

const getUserCountryCode = (state: IState): number => {
  const {
    user: { userCountryCode },
  } = state;
  return userCountryCode ?? 0;
};

const isUserPreferencesLoading = (state: IState): boolean => {
  const {
    user: {
      loaders: { userPreferences },
    },
  } = state;
  return userPreferences;
};

const getUserAssets = (state: IState): Asset[] => {
  const {
    user: { assets },
  } = state;

  if (assets.length <= 0) return [];

  return ObjectMapper.deserializeArray(Asset, assets);
};

const getUserActiveAssets = (state: IState): Asset[] => {
  const {
    user: { activeAssets },
  } = state;

  if (activeAssets.length <= 0) return [];

  return ObjectMapper.deserializeArray(Asset, activeAssets);
};

const isActiveAssetsLoading = (state: IState): boolean => {
  const {
    user: {
      loaders: { activeAssets },
    },
  } = state;

  return activeAssets;
};

const getFavouritePropertyIds = (state: IState): Wishlist[] => {
  const {
    user: { favouriteProperties },
  } = state;

  if (favouriteProperties.length <= 0) return [];

  const wishListIds = ObjectMapper.deserializeArray(Asset, favouriteProperties).map((property) => ({
    lease_listing_id: property.leaseTerm?.id,
    sale_listing_id: property.saleTerm?.id,
  }));

  return ObjectMapper.deserializeArray(Wishlist, wishListIds);
};

const getFavouriteProperties = (state: IState): Asset[] => {
  const {
    user: { favouriteProperties },
  } = state;

  return ObjectMapper.deserializeArray(Asset, favouriteProperties);
};

const getReferralCode = (state: IState): string => {
  const {
    user: { userProfile },
  } = state;

  if (!userProfile) return '';

  const profile = ObjectMapper.deserialize(UserProfile, userProfile);
  return profile.referralCode;
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
  getMetricSystem,
  getCurrency,
  getUserCountryCode,
  getUserAssets,
  getFavouritePropertyIds,
  getFavouriteProperties,
  getReferralCode,
  getUserActiveAssets,
  isActiveAssetsLoading,
};
