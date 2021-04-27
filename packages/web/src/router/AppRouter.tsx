import React, { Suspense, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Switch } from 'react-router-dom';
import { connect, useDispatch, ConnectedProps } from 'react-redux';
import { CommonActions } from '@homzhub/common/src/modules/common/actions';
import PrivateRoute from '@homzhub/web/src/router/PrivateRoute';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import AppLayout from '@homzhub/web/src/screens/appLayout';
import Login from '@homzhub/web/src/screens/login';
import SignUp from '@homzhub/web/src/screens/signUp';
import Landing from '@homzhub/web/src/screens/landing';
import MicroSite from '@homzhub/web/src/screens/microSite';
import OtpVerification from '@homzhub/web/src/components/organisms/OtpVerification';
import TermsAndCondition from '@homzhub/web/src/components/staticPages/TermsAndCondition';
import TermsServicesPayment from '@homzhub/web/src/components/staticPages/TermsServicesPayment';
import PrivacyPolicy from '@homzhub/web/src/components/staticPages/PrivacyPolicy';
import MobileVerification from '@homzhub/web/src/components/organisms/MobileVerification';
import FAQ from '@homzhub/web/src/screens/faq';

const AppRouter = (props: AppRouterProps): React.ReactElement => {
  const { isAuthenticated } = props;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(CommonActions.getCountries());
    dispatch(CommonActions.setDeviceCountry('IN'));
  }, []);
  const {
    APP_BASE,
    TERMS_CONDITION,
    TERMS_SERVICES_PAYMENTS,
    PRIVACY_POLICY,
    LOGIN,
    SIGNUP,
    OTP_VERIFICATION,
    MOBILE_VERIFICATION,
    MAHARASHTRA_CONNECT,
    FAQS,
  } = RouteNames.publicRoutes;
  const { DASHBOARD } = RouteNames.protectedRoutes;
  const { t } = useTranslation();
  return (
    <Suspense fallback={<div style={{ height: '100vh' }}>{t('webLoader:loadingText')}</div>}>
      <Switch>
        <Route
          exact
          path={APP_BASE}
          render={(renderProps): any => <Landing isAuthenticated={isAuthenticated} {...renderProps} />}
        />
        <Route
          exact
          path={MOBILE_VERIFICATION}
          render={(renderProps): any => <MobileVerification isAuthenticated={isAuthenticated} {...renderProps} />}
        />
        <Route
          exact
          path={OTP_VERIFICATION}
          render={(renderProps): any => <OtpVerification isAuthenticated={isAuthenticated} {...renderProps} />}
        />
        <Route
          exact
          path={SIGNUP}
          render={(renderProps): any => <SignUp isAuthenticated={isAuthenticated} {...renderProps} />}
        />
        <Route
          exact
          path={LOGIN}
          render={(renderProps): any => <Login isAuthenticated={isAuthenticated} {...renderProps} />}
        />
        <Route exact path={MAHARASHTRA_CONNECT} component={MicroSite} />
        <Route exact path={TERMS_CONDITION} component={TermsAndCondition} />
        <Route exact path={PRIVACY_POLICY} component={PrivacyPolicy} />
        <Route exact path={TERMS_SERVICES_PAYMENTS} component={TermsServicesPayment} />
        <Route exact path={MAHARASHTRA_CONNECT} component={MicroSite} />
        <Route exact path={FAQS} component={FAQ} />
        <PrivateRoute path={DASHBOARD} component={AppLayout} isAuthenticated={isAuthenticated} />
      </Switch>
    </Suspense>
  );
};
const mapStateToProps = (state: any): any => {
  const { isLoggedIn } = UserSelector;
  return {
    isAuthenticated: isLoggedIn(state),
  };
};

const connector = connect(mapStateToProps, null);

type AppRouterProps = ConnectedProps<typeof connector>;

export default connector(AppRouter);
