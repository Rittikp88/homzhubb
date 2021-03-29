import React, { Suspense, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Switch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppModes, ConfigHelper } from '@homzhub/common/src/utils/ConfigHelper';
import { CommonActions } from '@homzhub/common/src/modules/common/actions';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
import AppLayout from '@homzhub/web/src/screens/appLayout';
import Login from '@homzhub/web/src/screens/login';
import SignUp from '@homzhub/web/src/screens/signUp';
import Landing from '@homzhub/web/src/screens/landing';
import MicroSite from '@homzhub/web/src/screens/microSite';
import OtpVerification from '@homzhub/web/src/components/organisms/OtpVerification';
import TermsAndCondition from '@homzhub/web/src/components/staticPages/TermsAndCondition';
import PrivacyPolicy from '@homzhub/web/src/components/staticPages/PrivacyPolicy';
import MobileVerification from '@homzhub/web/src/components/organisms/MobileVerification';

export const AppRouter = (): React.ReactElement => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(CommonActions.getCountries());
    dispatch(CommonActions.setDeviceCountry('IN'));
  }, []);
  const {
    APP_BASE,
    TERMS_CONDITION,
    PRIVACY_POLICY,
    LOGIN,
    SIGNUP,
    OTP_VERIFICATION,
    MOBILE_VERIFICATION,
    MAHARASHTRA_CONNECT,
  } = RouteNames.publicRoutes;
  const { DASHBOARD } = RouteNames.protectedRoutes;
  const { t } = useTranslation();
  const isDebugMode = ConfigHelper.getAppMode() === AppModes.DEBUG;
  return (
    <Suspense fallback={<div>{t('webLoader:loadingText')}</div>}>
      <Switch>
        <Route exact path={APP_BASE} component={Landing} />
        <Route exact path={MAHARASHTRA_CONNECT} component={MicroSite} />
        <Route exact path={MOBILE_VERIFICATION} component={MobileVerification} />
        <Route exact path={OTP_VERIFICATION} component={OtpVerification} />
        <Route exact path={SIGNUP} component={SignUp} />
        <Route exact path={TERMS_CONDITION} component={TermsAndCondition} />
        <Route exact path={PRIVACY_POLICY} component={PrivacyPolicy} />
        <Route exact path={MAHARASHTRA_CONNECT} component={MicroSite} />
        {isDebugMode && (
          <>
            <Route exact path={LOGIN} component={Login} />
            <Route path={DASHBOARD} component={AppLayout} />
          </>
        )}
      </Switch>
    </Suspense>
  );
};
