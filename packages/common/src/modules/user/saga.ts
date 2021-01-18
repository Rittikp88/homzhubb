/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { call, put, takeEvery } from '@redux-saga/core/effects';
import { select } from 'redux-saga/effects';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { NavigationService } from '@homzhub/mobile/src/services/NavigationService';
import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { AnalyticsService } from '@homzhub/common/src/services/Analytics/AnalyticsService';
import { IUserTokens, StorageKeys, StorageService } from '@homzhub/common/src/services/storage/StorageService';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { CommonSelectors } from '@homzhub/common/src/modules/common/selectors';
import { UserActions, UserActionTypes } from '@homzhub/common/src/modules/user/actions';
import { SearchActions } from '@homzhub/common/src/modules/search/actions';
import { User } from '@homzhub/common/src/domain/models/User';
import { UserPreferences, UserPreferencesKeys } from '@homzhub/common/src/domain/models/UserPreferences';
import { SupportedLanguages } from '@homzhub/common/src/services/Localization/constants';
import {
  ILoginPayload,
  IRefreshTokenPayload,
  IUpdateUserPreferences,
  LoginTypes,
} from '@homzhub/common/src/domain/repositories/interfaces';
import { AuthenticationType, IAuthenticationEvent } from '@homzhub/common/src/services/Analytics/interfaces';
import { EventType } from '@homzhub/common/src/services/Analytics/EventType';

export function* login(action: IFluxStandardAction<ILoginPayload>) {
  if (!action.payload) return;
  const {
    payload: { data, callback, is_referral },
  } = action;
  const { EMAIL, OTP, REFERRAL } = AuthenticationType;

  let trackData: IAuthenticationEvent = {
    source: is_referral ? REFERRAL : data.action === LoginTypes.EMAIL ? EMAIL : OTP,
    ...(data.action === LoginTypes.EMAIL && { email: data.payload.email }),
    ...(data.action === LoginTypes.OTP && { phone_number: data.payload.phone_number }),
  };

  try {
    const userData: User = yield call(UserRepository.login, data);
    const tokens = { refresh_token: userData.refreshToken, access_token: userData.accessToken };

    yield put(UserActions.loginSuccess(tokens));
    yield StorageService.set<IUserTokens>(StorageKeys.USER, tokens);

    if (is_referral) {
      yield AnalyticsService.track(EventType.SignupSuccess, trackData);
    } else {
      yield AnalyticsService.track(EventType.LoginSuccess, trackData);
    }
    yield AnalyticsService.setUser(userData);

    if (!PlatformUtils.isWeb()) {
      const redirectionDetails = yield select(CommonSelectors.getRedirectionDetails);

      if (redirectionDetails.shouldRedirect && redirectionDetails.redirectionLink) {
        yield call(NavigationService.handleDynamicLinkNavigation, redirectionDetails);
      }
    }

    if (callback) {
      callback();
    }
  } catch (e) {
    const error = ErrorUtils.getErrorMessage(e.details);
    trackData = {
      ...trackData,
      error,
    };
    if (is_referral) {
      yield AnalyticsService.track(EventType.SignupFailure, trackData);
    } else {
      yield AnalyticsService.track(EventType.LoginFailure, trackData);
    }

    AlertHelper.error({ message: error });
    yield put(UserActions.loginFailure(error));
  }
}

export function* logout() {
  try {
    const tokens: IUserTokens = yield StorageService.get(StorageKeys.USER);
    yield call(UserRepository.logout, { refresh_token: tokens.refresh_token } as IRefreshTokenPayload);

    yield put(UserActions.logoutSuccess());
    yield put(SearchActions.setInitialState());
    yield put(UserActions.clearFavouriteProperties());
    yield StorageService.remove(StorageKeys.USER);
  } catch (e) {
    const error = ErrorUtils.getErrorMessage(e.details);
    AlertHelper.error({ message: error });
    yield put(UserActions.logoutFailure(error));
  }
}

export function* userProfile() {
  try {
    const response = yield call(UserRepository.getUserProfile);
    yield put(UserActions.getUserProfileSuccess(response));
  } catch (e) {
    const error = ErrorUtils.getErrorMessage(e.details);
    AlertHelper.error({ message: error });
    yield put(UserActions.getUserProfileFailure());
  }
}

export function* userPreferences() {
  try {
    const response: UserPreferences = yield call(UserRepository.getUserPreferences);
    yield put(UserActions.getUserPreferencesSuccess(response));

    const currentLanguage = yield I18nService.getLanguage();
    if (currentLanguage !== response.languageCode) {
      yield StorageService.set(StorageKeys.USER_SELECTED_LANGUAGE, response.languageCode);
      yield I18nService.changeLanguage(response.languageCode as SupportedLanguages);
    }
  } catch (e) {
    const error = ErrorUtils.getErrorMessage(e.details);
    AlertHelper.error({ message: error });
    yield put(UserActions.getUserPreferencesFailure());
  }
}

export function* updateUserPreferences(action: IFluxStandardAction<IUpdateUserPreferences>) {
  const { payload } = action;
  try {
    const response: UserPreferences = yield call(
      UserRepository.updateUserPreferences,
      payload as IUpdateUserPreferences
    );

    if (payload && UserPreferencesKeys.LanguageKey === Object.keys(payload)[0]) {
      yield StorageService.set(StorageKeys.USER_SELECTED_LANGUAGE, response.languageCode);
      yield I18nService.changeLanguage(response.languageCode as SupportedLanguages);
    }

    yield put(UserActions.getUserPreferencesSuccess(response));
  } catch (e) {
    const error = ErrorUtils.getErrorMessage(e.details);
    AlertHelper.error({ message: error });
    yield put(UserActions.getUserPreferencesFailure());
  }
}

export function* getUserAssets() {
  try {
    const response = yield call(AssetRepository.getPropertiesByStatus);
    yield put(UserActions.getAssetsSuccess(response));
    // eslint-disable-next-line no-empty
  } catch (e) {}
}

export function* getFavouriteProperties() {
  try {
    const response = yield call(UserRepository.getWishlistProperties);
    yield put(UserActions.getFavouritePropertiesSuccess(response));
    // eslint-disable-next-line no-empty
  } catch (e) {}
}

export function* watchUser() {
  yield takeEvery(UserActionTypes.AUTH.LOGIN, login);
  yield takeEvery(UserActionTypes.AUTH.LOGOUT, logout);
  yield takeEvery(UserActionTypes.GET.USER_PROFILE, userProfile);
  yield takeEvery(UserActionTypes.GET.USER_PREFERENCES, userPreferences);
  yield takeEvery(UserActionTypes.UPDATE.USER_PREFERENCES, updateUserPreferences);
  yield takeEvery(UserActionTypes.GET.USER_ASSETS, getUserAssets);
  yield takeEvery(UserActionTypes.GET.FAVOURITE_PROPERTIES, getFavouriteProperties);
}
